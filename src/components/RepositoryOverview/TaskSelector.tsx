/**
 * components/RepositoryOverview/TaskSelector.tsx
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Grid of selectable agent task cards.
 * The developer picks one before hitting "Run Agent Task".
 */

import React from "react";
import {
  Box,
  Paper,
  Typography,
  Tooltip,
} from "@mui/material";
import { MergeType as MergeTypeIcon, AutoFixHigh as AutoFixHighIcon, AccountTree as AccountTreeIcon, BugReport as BugReportIcon, RateReview as RateReviewIcon, Security as SecurityIcon } from "@mui/icons-material";
import type { AgentTask, AgentTaskType } from "../../types";
import { AGENT_TASKS } from "../../mocks/agentTasks";
import { overlay, primaryTint } from "../../theme/theme";

// Map icon names to actual MUI components (avoids eval and dynamic imports)
const ICONS: Record<string, React.ReactNode> = {
  MergeType: <MergeTypeIcon />,
  AutoFixHigh: <AutoFixHighIcon />,
  AccountTree: <AccountTreeIcon />,
  BugReport: <BugReportIcon />,
  RateReview: <RateReviewIcon />,
  Security: <SecurityIcon />,
};

interface Props {
  selectedTask: AgentTaskType | null;
  onTaskSelect: (taskId: AgentTaskType) => void;
}

export const TaskSelector: React.FC<Props> = ({ selectedTask, onTaskSelect }) => {
  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
        Choose an agent task
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
          gap: 1.5,
        }}
      >
        {AGENT_TASKS.map((task: AgentTask) => {
          const isSelected = selectedTask === task.id;
          return (
            <Tooltip key={task.id} title={task.description} placement="top">
              <Paper
                onClick={() => onTaskSelect(task.id)}
                sx={{
                  p: 1.5,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: isSelected ? "primary.main" : "divider",
                  backgroundColor: isSelected ? primaryTint.strong : overlay.faint,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    borderColor: "primary.light",
                    backgroundColor: primaryTint.hoverAlt,
                  },
                }}
              >
                <Box sx={{ color: isSelected ? "primary.light" : "text.secondary", mb: 0.5, display: "flex" }}>
                  {ICONS[task.icon]}
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 600, display: "block", lineHeight: 1.3 }}>
                  {task.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.68rem" }}>
                  {task.estimatedTime}
                </Typography>
              </Paper>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};
