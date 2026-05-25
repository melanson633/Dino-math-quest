import { SymphonyError, type Issue, type JsonMap, type SymphonyConfig, type TrackerClient } from "./types";

const ISSUE_FIELDS = `
  nodes {
    id
    identifier
    title
    description
    priority
    branchName
    url
    createdAt
    updatedAt
    state { name }
    labels { nodes { name } }
    relations {
      nodes {
        type
        relatedIssue { id identifier state { name } }
      }
    }
    inverseRelations {
      nodes {
        type
        issue { id identifier state { name } }
      }
    }
  }
`;

export class LinearClient implements TrackerClient {
  constructor(private readonly config: SymphonyConfig) {}

  async fetchCandidateIssues(): Promise<Issue[]> {
    const query = `
      query SymphonyCandidateIssues($projectSlug: String!, $states: [String!], $after: String) {
        issues(first: 50, after: $after, filter: {
          project: { slugId: { eq: $projectSlug } },
          state: { name: { in: $states } }
        }) {
          pageInfo { hasNextPage endCursor }
          ${ISSUE_FIELDS}
        }
      }
    `;
    return await this.fetchPagedIssues(query, {
      projectSlug: this.config.tracker.project_slug,
      states: this.config.tracker.active_states,
    });
  }

  async fetchIssuesByStates(stateNames: string[]): Promise<Issue[]> {
    if (stateNames.length === 0) return [];
    const query = `
      query SymphonyIssuesByStates($projectSlug: String!, $states: [String!], $after: String) {
        issues(first: 50, after: $after, filter: {
          project: { slugId: { eq: $projectSlug } },
          state: { name: { in: $states } }
        }) {
          pageInfo { hasNextPage endCursor }
          ${ISSUE_FIELDS}
        }
      }
    `;
    return await this.fetchPagedIssues(query, { projectSlug: this.config.tracker.project_slug, states: stateNames });
  }

  async fetchIssueStatesByIds(issueIds: string[]): Promise<Issue[]> {
    if (issueIds.length === 0) return [];
    const query = `
      query SymphonyIssueStates($ids: [ID!]) {
        issues(first: 100, filter: { id: { in: $ids } }) {
          ${ISSUE_FIELDS}
        }
      }
    `;
    const data = await this.graphql(query, { ids: issueIds });
    return issuesFromPayload(data);
  }

  async markIssueStarted(issue: Issue): Promise<void> {
    if (issue.state.toLowerCase() === "in progress") return;
    const preferred = ["In Progress", ...this.config.tracker.active_states.filter((state) => state.toLowerCase() !== "todo")];
    await this.transitionIssue(issue.id, preferred, "started");
  }

  async markIssueCompleted(issue: Issue): Promise<void> {
    await this.transitionIssue(issue.id, ["Done", ...this.config.tracker.terminal_states], "completed");
  }

  async rawGraphql(query: string, variables: JsonMap = {}): Promise<{ success: boolean; body?: unknown; error?: string }> {
    if (!query.trim()) return { success: false, error: "query must be non-empty" };
    if ((query.match(/\b(query|mutation|subscription)\b/g) ?? []).length !== 1) {
      return { success: false, error: "query must contain exactly one GraphQL operation" };
    }
    try {
      const body = await this.graphql(query, variables);
      return { success: true, body };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  private async fetchPagedIssues(query: string, variables: JsonMap): Promise<Issue[]> {
    const issues: Issue[] = [];
    let after: string | null = null;
    do {
      const data = await this.graphql(query, { ...variables, after });
      const connection = connectionFromPayload(data);
      issues.push(...connection.nodes.map(normalizeIssue));
      if (connection.pageInfo.hasNextPage && !connection.pageInfo.endCursor) {
        throw new SymphonyError("linear_missing_end_cursor", "Linear pagination reported another page without endCursor.");
      }
      after = connection.pageInfo.hasNextPage ? connection.pageInfo.endCursor : null;
    } while (after);
    return issues;
  }

  private async transitionIssue(issueId: string, preferredStateNames: string[], fallbackType: string): Promise<void> {
    const query = `
      query SymphonyIssueTeamStates($id: String!) {
        issue(id: $id) {
          team {
            states {
              nodes { id name type }
            }
          }
        }
      }
    `;
    const data = await this.graphql(query, { id: issueId });
    const state = selectWorkflowState(data, preferredStateNames, fallbackType);
    if (!state) throw new SymphonyError("linear_missing_state", `Could not find Linear state for type ${fallbackType}.`);
    const mutation = `
      mutation SymphonyIssueUpdateState($id: String!, $stateId: String!) {
        issueUpdate(id: $id, input: { stateId: $stateId }) {
          success
        }
      }
    `;
    const result = await this.graphql(mutation, { id: issueId, stateId: state.id });
    const payload = typeof result === "object" && result !== null ? ((result as JsonMap).issueUpdate as JsonMap | undefined) : undefined;
    if (!payload || payload.success !== true) throw new SymphonyError("linear_state_update_failed", "Linear issueUpdate did not report success.");
  }

  private async graphql(query: string, variables: JsonMap): Promise<unknown> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(this.config.tracker.endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: this.config.tracker.api_key,
        },
        body: JSON.stringify({ query, variables }),
        signal: controller.signal,
      });
      if (!response.ok) throw new SymphonyError("linear_api_status", `Linear returned HTTP ${response.status}.`);
      const body = (await response.json()) as JsonMap;
      if (Array.isArray(body.errors) && body.errors.length > 0) {
        throw new SymphonyError("linear_graphql_errors", JSON.stringify(body.errors));
      }
      if (!("data" in body)) throw new SymphonyError("linear_unknown_payload", "Linear response did not contain data.");
      return body.data;
    } catch (error) {
      if (error instanceof SymphonyError) throw error;
      throw new SymphonyError("linear_api_request", error instanceof Error ? error.message : String(error));
    } finally {
      clearTimeout(timeout);
    }
  }
}

function selectWorkflowState(data: unknown, preferredStateNames: string[], fallbackType: string): { id: string; name: string } | null {
  const issue = typeof data === "object" && data !== null ? ((data as JsonMap).issue as JsonMap | undefined) : undefined;
  const team = typeof issue?.team === "object" && issue.team !== null ? (issue.team as JsonMap) : {};
  const states = typeof team.states === "object" && team.states !== null ? (team.states as JsonMap) : {};
  const nodes = Array.isArray(states.nodes) ? states.nodes.filter((node): node is JsonMap => typeof node === "object" && node !== null && !Array.isArray(node)) : [];
  const byName = new Map(nodes.map((node) => [String(node.name ?? "").toLowerCase(), node]));
  for (const name of preferredStateNames) {
    const node = byName.get(name.toLowerCase());
    if (node && typeof node.id === "string" && typeof node.name === "string") return { id: node.id, name: node.name };
  }
  const byType = nodes.find((node) => String(node.type ?? "").toLowerCase() === fallbackType.toLowerCase());
  return byType && typeof byType.id === "string" && typeof byType.name === "string" ? { id: byType.id, name: byType.name } : null;
}

function issuesFromPayload(data: unknown): Issue[] {
  return connectionFromPayload(data).nodes.map(normalizeIssue);
}

function connectionFromPayload(data: unknown): { nodes: JsonMap[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } {
  const issues = typeof data === "object" && data !== null ? (data as JsonMap).issues : null;
  if (typeof issues !== "object" || issues === null) throw new SymphonyError("linear_unknown_payload", "Missing issues connection.");
  const map = issues as JsonMap;
  if (!Array.isArray(map.nodes)) throw new SymphonyError("linear_unknown_payload", "Missing issue nodes.");
  const pageInfo = typeof map.pageInfo === "object" && map.pageInfo !== null ? (map.pageInfo as JsonMap) : {};
  return {
    nodes: map.nodes.filter((node): node is JsonMap => typeof node === "object" && node !== null && !Array.isArray(node)),
    pageInfo: {
      hasNextPage: pageInfo.hasNextPage === true,
      endCursor: typeof pageInfo.endCursor === "string" ? pageInfo.endCursor : null,
    },
  };
}

function normalizeIssue(raw: JsonMap): Issue {
  return {
    id: requiredString(raw.id, "id"),
    identifier: requiredString(raw.identifier, "identifier"),
    title: requiredString(raw.title, "title"),
    description: typeof raw.description === "string" ? raw.description : null,
    priority: typeof raw.priority === "number" && Number.isInteger(raw.priority) ? raw.priority : null,
    state: nestedString(raw.state, "name") ?? "",
    branch_name: typeof raw.branchName === "string" ? raw.branchName : null,
    url: typeof raw.url === "string" ? raw.url : null,
    labels: normalizeLabels(raw.labels),
    blocked_by: normalizeBlockers(raw.relations, raw.inverseRelations),
    created_at: isoString(raw.createdAt),
    updated_at: isoString(raw.updatedAt),
  };
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value) throw new SymphonyError("linear_unknown_payload", `Missing issue ${field}.`);
  return value;
}

function nestedString(value: unknown, key: string): string | null {
  return typeof value === "object" && value !== null && typeof (value as JsonMap)[key] === "string" ? ((value as JsonMap)[key] as string) : null;
}

function normalizeLabels(value: unknown): string[] {
  const nodes = typeof value === "object" && value !== null && Array.isArray((value as JsonMap).nodes) ? ((value as JsonMap).nodes as unknown[]) : [];
  return nodes.map((node) => nestedString(node, "name")).filter((name): name is string => !!name).map((name) => name.toLowerCase());
}

function normalizeBlockers(relationsValue: unknown, inverseRelationsValue: unknown): Issue["blocked_by"] {
  const direct = relationNodes(relationsValue)
    .filter((relation) => relation.type === "blocked_by")
    .map((relation) => blockerFromIssue(relation.relatedIssue));
  const inverse = relationNodes(inverseRelationsValue)
    .filter((relation) => relation.type === "blocks")
    .map((relation) => blockerFromIssue(relation.issue));
  return [...direct, ...inverse].filter((blocker) => blocker.id || blocker.identifier || blocker.state);
}

function relationNodes(value: unknown): JsonMap[] {
  return typeof value === "object" && value !== null && Array.isArray((value as JsonMap).nodes) ? ((value as JsonMap).nodes as JsonMap[]) : [];
}

function blockerFromIssue(value: unknown): Issue["blocked_by"][number] {
  const issue = typeof value === "object" && value !== null ? (value as JsonMap) : {};
  return {
    id: typeof issue.id === "string" ? issue.id : null,
    identifier: typeof issue.identifier === "string" ? issue.identifier : null,
    state: nestedString(issue.state, "name"),
  };
}

function isoString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return Number.isNaN(Date.parse(value)) ? null : value;
}
