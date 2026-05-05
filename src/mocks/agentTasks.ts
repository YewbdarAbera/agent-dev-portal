/**
 * mocks/agentTasks.ts
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * The list of task types a developer can trigger against a repo.
 * Each task has enough metadata for the UI to describe what it does.
 */

import type { AgentTask } from "../types";

export const AGENT_TASKS: AgentTask[] = [
  {
    id: "create-pr",
    label: "Create Pull Request",
    description: "Drafts a PR with a summary of recent commits and links related issues.",
    icon: "MergeType",
    estimatedTime: "~1 min",
  },
  {
    id: "refactor",
    label: "Refactor Code",
    description: "Identifies dead code, large functions, and suggests cleaner patterns.",
    icon: "AutoFixHigh",
    estimatedTime: "~3 min",
  },
  {
    id: "dependency-scan",
    label: "Dependency Scan",
    description: "Checks for outdated or vulnerable packages and proposes upgrades.",
    icon: "AccountTree",
    estimatedTime: "~2 min",
  },
  {
    id: "run-tests",
    label: "Run Tests",
    description: "Executes the test suite and reports coverage, failures, and flaky tests.",
    icon: "BugReport",
    estimatedTime: "~4 min",
  },
  {
    id: "code-review",
    label: "AI Code Review",
    description: "Reviews the last diff for bugs, logic errors, and style violations.",
    icon: "RateReview",
    estimatedTime: "~2 min",
  },
  {
    id: "security-scan",
    label: "Security Scan",
    description: "Scans for common vulnerabilities, secrets in code, and OWASP top-10 risks.",
    icon: "Security",
    estimatedTime: "~3 min",
  },
];
