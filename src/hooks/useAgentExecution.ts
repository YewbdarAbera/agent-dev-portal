/**
 * hooks/useAgentExecution.ts
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Simulates a streaming agent run against a specific repository.
 * Log lines are generated from the repo's real data (name, language,
 * topics, coverage, health) so each repo × task combination produces
 * unique output — matching what a real SSE stream would deliver.
 */

import { useState, useRef, useCallback } from "react";
import type { AgentExecution, AgentTaskType, ExecutionStatus, LogEntry, Repository } from "../types";
import { getTaskLogs } from "../mocks/streamingLogs";

// Only the id is needed at stream time — everything else stays in the repo object in App.tsx

// How long to wait between each streamed log line (ms)
const LOG_INTERVAL_MS = 700;

function buildInitialExecution(): AgentExecution {
  return {
    repoId: null,
    taskType: "create-pr",
    status: "idle",
    startedAt: null,
    finishedAt: null,
    logs: [],
    summary: null,
  };
}

export function useAgentExecution() {
  const [execution, setExecution] = useState<AgentExecution>(buildInitialExecution);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Store the repo so retry() can re-run against the same repo without needing it passed again
  const repoRef = useRef<Repository | null>(null);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const runTask = useCallback((taskType: AgentTaskType, repo: Repository) => {
    clearTimer();
    repoRef.current = repo;

    // Pull the pre-authored log sequence for this exact repo × task combination
    const logTemplates = getTaskLogs(repo.id, taskType);
    let index = 0;

    // Move to pending briefly so the UI can show the transition
    setExecution({
      repoId: repo.id,
      taskType,
      status: "pending",
      startedAt: null,
      finishedAt: null,
      logs: [],
      summary: null,
    });

    // Short delay before starting — feels more realistic
    setTimeout(() => {
      setExecution((prev) => ({ ...prev, status: "running", startedAt: new Date().toISOString() }));

      intervalRef.current = setInterval(() => {
        if (index >= logTemplates.length) {
          clearTimer();

          const hasError = logTemplates.some((l) => l.level === "error");
          const finalStatus: ExecutionStatus = hasError ? "failed" : "success";
          const summary = hasError
            ? "Task completed with errors. Review the log for details."
            : "Task completed successfully.";

          setExecution((prev) => ({
            ...prev,
            status: finalStatus,
            finishedAt: new Date().toISOString(),
            summary,
          }));
          return;
        }

        const template = logTemplates[index];
        const newEntry: LogEntry = {
          id: `log-${index}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          level: template.level,
          message: template.message,
          ...(template.diff ? { diff: template.diff } : {}),
        };

        setExecution((prev) => ({
          ...prev,
          logs: [...prev.logs, newEntry],
        }));

        index++;
      }, LOG_INTERVAL_MS);
    }, 600);
  }, []);

  const retry = useCallback(() => {
    if (repoRef.current) {
      runTask(execution.taskType, repoRef.current);
    }
  }, [execution.taskType, runTask]);

  const reset = useCallback(() => {
    clearTimer();
    repoRef.current = null;
    setExecution(buildInitialExecution());
  }, []);

  return { execution, runTask, retry, reset };
}
