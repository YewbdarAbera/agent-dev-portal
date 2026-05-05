/**
 * components/AgentExecution/DetailsModal.tsx
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Drawer that opens from the right and shows the full execution log
 * plus a summary of what the agent did. Useful after the run finishes.
 */

import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Alert,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import type { AgentExecution } from "../../types";
import { LogLine } from "./LogLine";
import { StatusBadge } from "./StatusBadge";
import dayjs from "dayjs";
import { AGENT_TASKS } from "../../mocks/agentTasks";
import { overlay } from "../../theme/theme";

interface Props {
  open: boolean;
  onClose: () => void;
  execution: AgentExecution;
}

export const DetailsModal: React.FC<Props> = ({ open, onClose, execution }) => {
  const task = AGENT_TASKS.find((t) => t.id === execution.taskType);

  const duration =
    execution.startedAt && execution.finishedAt
      ? `${((new Date(execution.finishedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000).toFixed(1)}s`
      : null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 520 },
            bgcolor: "background.paper",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          },
        },
      }}
    >
      {/* Header */}
      <Box className="flex items-center justify-between">
        <Box>
          <Typography variant="h6">{task?.label ?? "Agent Task"}</Typography>
          <Typography variant="caption" color="text.secondary">
            Execution details
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Status + timing */}
      <Box className="flex items-center gap-3">
        <StatusBadge status={execution.status} />
        {execution.startedAt && (
          <Typography variant="caption" color="text.secondary">
            Started {dayjs(execution.startedAt).format("HH:mm:ss")}
          </Typography>
        )}
        {duration && (
          <Typography variant="caption" color="text.secondary">
            · {duration}
          </Typography>
        )}
      </Box>

      {/* Summary alert */}
      {execution.summary && (
        <Alert
          severity={execution.status === "success" ? "success" : "error"}
          sx={{ fontSize: "0.82rem" }}
        >
          {execution.summary}
        </Alert>
      )}

      <Divider />

      {/* Full log */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Full Log
        </Typography>
        <Box
          className="log-scroll"
          sx={{
            bgcolor: "background.terminal",
            borderRadius: 1,
            p: 2,
            overflowY: "auto",
            maxHeight: "calc(100vh - 300px)",
            border: `1px solid ${overlay.soft}`,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          {execution.logs.length === 0 ? (
            <Typography variant="caption" color="text.secondary">
              No logs yet.
            </Typography>
          ) : (
            execution.logs.map((entry) => <LogLine key={entry.id} entry={entry} />)
          )}
        </Box>
      </Box>
    </Drawer>
  );
};
