/**
 * components/RepositoryOverview/RepositoryOverview.tsx
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Center panel — shows repo metadata, insights, and the task launcher.
 * Receives the selected repo from the parent and bubbles up the run action.
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import { PlayArrow as PlayArrowIcon, CallSplit as CallSplitIcon, StarBorder as StarOutlineIcon, ErrorOutlined as ErrorOutlineIcon, MergeType as MergeTypeIcon, DeviceHub as BranchIcon } from "@mui/icons-material";
import type { Repository, AgentTaskType } from "../../types";
import { MetaStat } from "./MetaStat";
import { HealthScore } from "./HealthScore";
import { TaskSelector } from "./TaskSelector";
import { LanguageBadge } from "../RepositoryList/LanguageBadge";
import { overlay, statusColors } from "../../theme/theme";
import dayjs from "dayjs";

interface Props {
  repo: Repository;
  onRunTask: (taskType: AgentTaskType) => void;
}

export const RepositoryOverview: React.FC<Props> = ({ repo, onRunTask }) => {
  const [selectedTask, setSelectedTask] = useState<AgentTaskType | null>(null);

  const handleRun = () => {
    if (selectedTask) onRunTask(selectedTask);
  };

  return (
    <Box className="flex flex-col h-full overflow-y-auto gap-4 pr-1" sx={{ scrollbarWidth: "thin" }}>

      {/* Repo header */}
      <Box className="flex items-start justify-between">
        <Box>
          <Box className="flex items-center gap-2 mb-1">
            <Typography variant="h5">{repo.name}</Typography>
            <Chip
              label={repo.visibility}
              size="small"
              sx={{
                fontSize: "0.7rem",
                bgcolor: repo.visibility === "public" ? statusColors.success.bg : statusColors.pending.bg,
                color: repo.visibility === "public" ? "success.main" : "warning.main",
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {repo.description}
          </Typography>
          <Box className="flex items-center gap-2">
            <LanguageBadge language={repo.language} />
            <Typography variant="caption" color="text.secondary">
              /{repo.owner}
            </Typography>
          </Box>
        </Box>
        <HealthScore score={repo.healthScore} />
      </Box>

      <Divider />

      {/* Stats grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 1.5,
        }}
      >
        <MetaStat label="Stars" value={repo.stars} icon={<StarOutlineIcon fontSize="small" />} />
        <MetaStat label="Forks" value={repo.forks} icon={<CallSplitIcon fontSize="small" />} />
        <MetaStat label="Open Issues" value={repo.openIssues} icon={<ErrorOutlineIcon fontSize="small" />} accent={repo.openIssues > 5 ? "#fbbf24" : undefined} />
        <MetaStat label="Open PRs" value={repo.openPRs} icon={<MergeTypeIcon fontSize="small" />} />
        <MetaStat label="Branch" value={repo.defaultBranch} icon={<BranchIcon fontSize="small" />} />
        <MetaStat label="Last Commit" value={dayjs(repo.lastCommit).format("MMM D, YYYY")} icon={<CallSplitIcon fontSize="small" />} />
      </Box>

      {/* Test coverage bar */}
      <Box>
        <Box className="flex items-center justify-between mb-1">
          <Typography variant="caption" color="text.secondary">
            Test Coverage
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: repo.coverage >= 80 ? "success.main" : "warning.main" }}>
            {repo.coverage}%
          </Typography>
        </Box>
        <Tooltip title={`${repo.coverage}% of lines covered by tests`}>
          <LinearProgress
            variant="determinate"
            value={repo.coverage}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: overlay.soft,
              "& .MuiLinearProgress-bar": {
                bgcolor: repo.coverage >= 80 ? "success.main" : "warning.main",
              },
            }}
          />
        </Tooltip>
      </Box>

      <Divider />

      {/* Task selector */}
      <TaskSelector selectedTask={selectedTask} onTaskSelect={setSelectedTask} />

      {/* Run button */}
      <Button
        variant="contained"
        size="large"
        startIcon={<PlayArrowIcon />}
        disabled={!selectedTask}
        onClick={handleRun}
        sx={{
          mt: "auto",
          py: 1.5,
          background: selectedTask
            ? "linear-gradient(135deg, #6366f1, #4f46e5)"
            : undefined,
        }}
      >
        {selectedTask ? "Run Agent Task" : "Select a task above"}
      </Button>
    </Box>
  );
};
