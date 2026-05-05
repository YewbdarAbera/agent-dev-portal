/**
 * components/AgentExecution/AgentExecutionPanel.tsx
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Right panel — live log stream, status badge, retry + details actions.
 * Auto-scrolls to the bottom as new log lines come in.
 */

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  Divider,
} from "@mui/material";
import { Refresh as RefreshIcon, InfoOutlined as InfoOutlinedIcon, Terminal as TerminalIcon } from "@mui/icons-material";
import type { AgentExecution } from "../../types";
import { LogLine } from "./LogLine";
import { StatusBadge } from "./StatusBadge";
import { DetailsModal } from "./DetailsModal";
import { AGENT_TASKS } from "../../mocks/agentTasks";
import { overlay } from "../../theme/theme";

interface Props {
  execution: AgentExecution;
  onRetry: () => void;
}

export const AgentExecutionPanel: React.FC<Props> = ({ execution, onRetry }) => {
  const logEndRef = useRef<HTMLDivElement>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Scroll to bottom every time a new log line arrives
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [execution.logs.length]);

  const task = AGENT_TASKS.find((t) => t.id === execution.taskType);
  const isDone = execution.status === "success" || execution.status === "failed";

  return (
    <Box className="flex flex-col h-full gap-3">

      {/* Panel header */}
      <Box className="flex items-center gap-2">
        <TerminalIcon sx={{ color: "primary.main" }} />
        <Typography variant="h6">Agent Execution</Typography>
        <Box sx={{ ml: "auto" }}>
          <StatusBadge status={execution.status} />
        </Box>
      </Box>

      {/* Task name + timing */}
      {execution.status !== "idle" && (
        <Box
          sx={{
            bgcolor: overlay.subtle,
            border: `1px solid ${overlay.soft}`,
            borderRadius: 2,
            p: 1.5,
          }}
        >
          <Typography variant="subtitle2" color="primary.light">
            {task?.label ?? execution.taskType}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {task?.description}
          </Typography>
        </Box>
      )}

      <Divider />

      {/* Idle placeholder */}
      {execution.status === "idle" && (
        <Box className="flex flex-col items-center justify-center flex-1 gap-2">
          <TerminalIcon sx={{ fontSize: 48, color: overlay.ghost }} />
          <Typography variant="body2" color="text.secondary" align="center">
            No task running yet.
            <br />
            Select a repo, pick a task, and hit Run.
          </Typography>
        </Box>
      )}

      {/* Log stream */}
      {execution.status !== "idle" && (
        <Box
          className="log-scroll flex-1 overflow-y-auto"
          sx={{
            bgcolor: "background.terminal",
            borderRadius: 1,
            p: 2,
            border: `1px solid ${overlay.soft}`,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minHeight: 0,
          }}
        >
          {execution.logs.length === 0 && (
            <Typography variant="caption" color="text.secondary">
              Waiting for agent output...
            </Typography>
          )}
          {execution.logs.map((entry) => (
            <LogLine key={entry.id} entry={entry} />
          ))}
          {/* Invisible div we scroll to */}
          <div ref={logEndRef} />
        </Box>
      )}

      {/* Summary alert on finish */}
      {isDone && execution.summary && (
        <Alert severity={execution.status === "success" ? "success" : "error"} sx={{ fontSize: "0.82rem" }}>
          {execution.summary}
        </Alert>
      )}

      {/* Action buttons */}
      {isDone && (
        <Box className="flex gap-2">
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{ flex: 1 }}
          >
            Retry
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<InfoOutlinedIcon />}
            onClick={() => setDetailsOpen(true)}
            sx={{ flex: 1 }}
          >
            View Details
          </Button>
        </Box>
      )}

      {/* Details drawer */}
      <DetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        execution={execution}
      />
    </Box>
  );
};
