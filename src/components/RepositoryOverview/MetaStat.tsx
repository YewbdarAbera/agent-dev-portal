/**
 * components/RepositoryOverview/MetaStat.tsx
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Reusable stat tile used in the overview grid.
 * Icon + label + value in a small card.
 */

import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { overlay } from "../../theme/theme";

interface Props {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string; // optional color override for the value
}

export const MetaStat: React.FC<Props> = ({ label, value, icon, accent }) => {
  return (
    <Paper
      sx={{
        p: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        bgcolor: overlay.subtle,
        border: `1px solid ${overlay.soft}`,
      }}
    >
      <Box sx={{ color: "primary.main", display: "flex" }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
          {label}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: accent ?? "text.primary", lineHeight: 1.2 }}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
};
