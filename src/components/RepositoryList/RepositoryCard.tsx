/**
 * components/RepositoryList/RepositoryCard.tsx
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * A single row card in the repo list.
 * Highlights if selected and shows the key stats at a glance.
 */

import React from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import { StarBorder as StarOutlineIcon, CallSplit as CallSplitIcon, ErrorOutlined as ErrorOutlineIcon, LockOutlined as LockOutlinedIcon } from "@mui/icons-material";
import type { Repository } from "../../types";
import { LanguageBadge } from "./LanguageBadge";
import { primaryTint } from "../../theme/theme";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Props {
  repo: Repository;
  isSelected: boolean;
  onSelect: (repo: Repository) => void;
}

export const RepositoryCard: React.FC<Props> = ({ repo, isSelected, onSelect }) => {
  return (
    <Paper
      onClick={() => onSelect(repo)}
      sx={{
        p: 2,
        cursor: "pointer",
        borderColor: isSelected ? "primary.main" : "divider",
        borderWidth: isSelected ? 2 : 1,
        backgroundColor: isSelected ? primaryTint.selected : "background.paper",
        transition: "all 0.15s ease",
        "&:hover": {
          borderColor: "primary.light",
          backgroundColor: primaryTint.hover,
        },
      }}
    >
      {/* Top row: name + visibility badge */}
      <Box className="flex items-center justify-between mb-1">
        <Box className="flex items-center gap-2">
          <Typography variant="subtitle2" color="primary.light" sx={{ fontWeight: 700 }}>
            {repo.name}
          </Typography>
          {repo.visibility === "private" && (
            <Tooltip title="Private repository">
              <LockOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            </Tooltip>
          )}
        </Box>
        <LanguageBadge language={repo.language} />
      </Box>

      {/* Description */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1.5, lineHeight: 1.5, fontSize: "0.78rem" }}
        noWrap
      >
        {repo.description}
      </Typography>

      {/* Stats row */}
      <Box className="flex items-center gap-3 flex-wrap">
        <Stat icon={<StarOutlineIcon sx={{ fontSize: 14 }} />} value={repo.stars} />
        <Stat icon={<CallSplitIcon sx={{ fontSize: 14 }} />} value={repo.forks} />
        <Stat icon={<ErrorOutlineIcon sx={{ fontSize: 14 }} />} value={`${repo.openIssues} issues`} />
        <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
          {dayjs(repo.lastCommit).fromNow()}
        </Typography>
      </Box>

      {/* Topics */}
      {repo.topics.length > 0 && (
        <Box className="flex flex-wrap gap-1 mt-2">
          {repo.topics.map((topic) => (
            <Chip
              key={topic}
              label={topic}
              size="small"
              sx={{ fontSize: "0.68rem", height: 20, bgcolor: primaryTint.chip, color: "primary.light" }}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};

// Tiny inline stat with an icon
function Stat({ icon, value }: { icon: React.ReactNode; value: string | number }) {
  return (
    <Box className="flex items-center gap-0.5">
      <Box sx={{ color: "text.secondary", display: "flex" }}>{icon}</Box>
      <Typography variant="caption" color="text.secondary">
        {value}
      </Typography>
    </Box>
  );
}
