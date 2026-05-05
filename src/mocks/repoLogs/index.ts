/**
 * mocks/repoLogs/index.ts
 *
 * Assembles the per-repo log lookup table.
 * Structure: REPO_TASK_LOGS[repoId][taskType] → LogTemplate[]
 *
 * Each repo file is authored independently so running the same task
 * on two different repos always produces unique, repo-specific output.
 */

import type { AgentTaskType, LogTemplate } from "../../types";
import { paymentServiceLogs }    from "./repo-1-payment-service";
import { authGatewayLogs }       from "./repo-2-auth-gateway";
import { dataPipelineLogs }      from "./repo-3-data-pipeline";
import { frontendShellLogs }     from "./repo-4-frontend-shell";
import { infraTerraformLogs }    from "./repo-5-infra-terraform";
import { notificationWorkerLogs }from "./repo-6-notification-worker";
import { searchIndexerLogs }     from "./repo-7-search-indexer";
import { cliToolkitLogs }        from "./repo-8-cli-toolkit";

const REPO_TASK_LOGS: Record<string, Record<AgentTaskType, LogTemplate[]>> = {
  "repo-1": paymentServiceLogs,
  "repo-2": authGatewayLogs,
  "repo-3": dataPipelineLogs,
  "repo-4": frontendShellLogs,
  "repo-5": infraTerraformLogs,
  "repo-6": notificationWorkerLogs,
  "repo-7": searchIndexerLogs,
  "repo-8": cliToolkitLogs,
};

export function getTaskLogs(repoId: string, taskType: AgentTaskType): LogTemplate[] {
  return REPO_TASK_LOGS[repoId]?.[taskType] ?? [];
}
