/**
 * components/RepositoryOverview/HealthScore.tsx
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Circular progress indicator for repo health.
 * Color shifts from red → yellow → green based on the score.
 */

import React from "react";
import { Box, CircularProgress, Typography, Tooltip } from "@mui/material";
import { statusColors, overlay } from "../../theme/theme";

interface Props {
  score: number; // 0 – 100
}

function scoreColor(score: number): string {
  if (score >= 80) return statusColors.success.text;
  if (score >= 55) return statusColors.pending.text;
  return statusColors.failed.text;
}

export const HealthScore: React.FC<Props> = ({ score }) => {
  const color = scoreColor(score);

  return (
    <Tooltip title="Overall repo health based on coverage, open issues, and freshness">
      <Box className="relative inline-flex items-center justify-center" sx={{ width: 64, height: 64 }}>
        {/* Background ring */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={64}
          thickness={4}
          sx={{ color: overlay.divider, position: "absolute" }}
        />
        {/* Actual score */}
        <CircularProgress
          variant="determinate"
          value={score}
          size={64}
          thickness={4}
          sx={{ color, position: "absolute" }}
        />
        <Typography variant="caption" sx={{ fontWeight: 700, color }}>
          {score}
        </Typography>
      </Box>
    </Tooltip>
  );
};
