/**
 * mocks/streamingLogs.ts
 *
 * Public facade for per-repo log data.
 * Actual log sequences live in mocks/repoLogs/ — one file per repo.
 */

export { getTaskLogs } from "./repoLogs/index";
