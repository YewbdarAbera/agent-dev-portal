/**
 * components/Layout/AppLayout.tsx
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Three-column layout shell:
 *   [Repo List] | [Repo Overview] | [Agent Execution]
 *
 * Columns are sized so the list is narrower (it's just a picker)
 * and the overview + execution share the rest equally.
 * On smaller screens each column scrolls independently.
 */

import React from "react";
import { Box, Paper, Typography, Divider } from "@mui/material";
import { SmartToyOutlined as SmartToyOutlinedIcon } from "@mui/icons-material";
import { overlay } from "../../theme/theme";

interface Props {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  // true when no repo has been selected yet — dims center + right
  isRepoSelected: boolean;
}

export const AppLayout: React.FC<Props> = ({ left, center, right, isRepoSelected }) => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      {/* Top nav */}
      <Box
        component="header"
        sx={{
          px: 3,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: `1px solid ${overlay.border}`,
          bgcolor: "background.paper",
          flexShrink: 0,
        }}
      >
        <SmartToyOutlinedIcon sx={{ color: "primary.main" }} />
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}>
          Agent Dev Portal
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Typography variant="caption" color="text.secondary">
          Git Repository Workflow + AI Agent Execution
        </Typography>
        <Box sx={{ ml: "auto" }}>
          <Typography variant="caption" color="text.secondary">
            Yewbdar Abera · May 2026
          </Typography>
        </Box>
      </Box>

      {/* Three-column body */}
      <Box
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "300px 1fr 1fr",
          gap: 0,
          overflow: "hidden",
        }}
      >
        {/* Left: Repo list */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 0,
            borderRight: `1px solid ${overlay.border}`,
            p: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {left}
        </Paper>

        {/* Center: Repo overview */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 0,
            borderRight: `1px solid ${overlay.border}`,
            p: 3,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            opacity: isRepoSelected ? 1 : 0.4,
            transition: "opacity 0.2s ease",
            pointerEvents: isRepoSelected ? "auto" : "none",
          }}
        >
          {center}
        </Paper>

        {/* Right: Agent execution */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 0,
            p: 3,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            opacity: isRepoSelected ? 1 : 0.4,
            transition: "opacity 0.2s ease",
            pointerEvents: isRepoSelected ? "auto" : "none",
          }}
        >
          {right}
        </Paper>
      </Box>
    </Box>
  );
};
