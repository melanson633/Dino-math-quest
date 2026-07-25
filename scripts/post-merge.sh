#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --filter db push

# Restore Compound Engineering skills into Replit's skill-discovery directory
bash "$(dirname "$0")/restore-ce-skills.sh"
