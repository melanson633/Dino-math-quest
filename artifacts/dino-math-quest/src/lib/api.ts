/**
 * Returns the URL for an API endpoint on the shared API server.
 * In Replit's path-based routing the API service is mounted at /api,
 * so callers can always reach it via an absolute path.
 *
 * @param endpoint - the route path without the /api prefix, e.g. "tts"
 */
export function getApiUrl(endpoint: string): string {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `/api${path}`;
}
