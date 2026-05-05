/**
 * types/index.ts
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Central type definitions for the whole app.
 * Keeping them in one place makes it easy to update
 * when the API contract changes later.
 */

// --- Repository ---

export type Language =
  | "TypeScript"
  | "Python"
  | "Go"
  | "Java"
  | "Rust"
  | "JavaScript";

export interface Repository {
  id: string;
  name: string;
  description: string;
  language: Language;
  stars: number;
  forks: number;
  openIssues: number;
  openPRs: number;
  lastCommit: string; // ISO date string
  defaultBranch: string;
  visibility: "public" | "private";
  owner: string;
  topics: string[];
  coverage: number; // test coverage %
  healthScore: number; // 0-100
}

// --- Agent Tasks ---

export type AgentTaskType =
  | "create-pr"
  | "refactor"
  | "dependency-scan"
  | "run-tests"
  | "code-review"
  | "security-scan";

export interface AgentTask {
  id: AgentTaskType;
  label: string;
  description: string;
  icon: string; // MUI icon name — resolved in the component
  estimatedTime: string; // e.g. "~2 min"
}

// --- Execution ---

export type ExecutionStatus = "idle" | "pending" | "running" | "success" | "failed";

/**
 * Optional structured diff payload attached to a log line.
 * When present, the log line renders a small inline diff card
 * (file path + green additions / red deletions) instead of just text.
 *
 * Used by AI Code Review and Refactor tasks to surface concrete
 * suggested changes the developer can scan at a glance.
 */
export interface CodeDiff {
  file: string;             // e.g. "src/payment-service/webhook.ts"
  startLine?: number;       // line number where the change begins
  deletions: string[];      // lines to remove (rendered with red tint and -)
  additions: string[];      // lines to add (rendered with green tint and +)
  note?: string;            // optional caption shown below the diff
}

export interface LogEntry {
  id: string;
  timestamp: string; // ISO string
  level: "info" | "warn" | "error" | "success";
  message: string;
  diff?: CodeDiff;          // when set, the log line renders an inline diff card
}

// Raw log template used in mock data — no id or timestamp yet (added at stream time)
export type LogTemplate = Pick<LogEntry, "level" | "message" | "diff">;

export interface AgentExecution {
  repoId: string | null;   // which repo this run is against
  taskType: AgentTaskType;
  status: ExecutionStatus;
  startedAt: string | null;
  finishedAt: string | null;
  logs: LogEntry[];
  summary: string | null; // populated on success/failure
}
