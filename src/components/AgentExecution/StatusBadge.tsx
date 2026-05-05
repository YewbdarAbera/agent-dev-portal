/**
 * components/AgentExecution/StatusBadge.tsx
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Visual pill for the execution lifecycle:
 * idle → pending → running → success | failed
 * The "running" state pulses to show it's alive.
 */

import React from "react";
import { Chip, Box } from "@mui/material";
import { HourglassEmpty, AutoMode, CheckCircleOutlined, ErrorOutlined, RadioButtonUnchecked } from "@mui/icons-material";
import type { ExecutionStatus } from "../../types";
import { statusColors } from "../../theme/theme";

interface StatusConfig {
  label: string;
  color: string;
  bgcolor: string;
  icon: React.ReactNode;
}

const STATUS_CONFIG: Record<ExecutionStatus, StatusConfig> = {
  idle:    { label: "Idle",    color: statusColors.idle.text,    bgcolor: statusColors.idle.bg,    icon: <RadioButtonUnchecked sx={{ fontSize: 16 }} /> },
  pending: { label: "Pending", color: statusColors.pending.text, bgcolor: statusColors.pending.bg, icon: <HourglassEmpty sx={{ fontSize: 16 }} /> },
  running: { label: "Running", color: statusColors.running.text, bgcolor: statusColors.running.bg, icon: <AutoMode sx={{ fontSize: 16 }} /> },
  success: { label: "Success", color: statusColors.success.text, bgcolor: statusColors.success.bg, icon: <CheckCircleOutlined sx={{ fontSize: 16 }} /> },
  failed:  { label: "Failed",  color: statusColors.failed.text,  bgcolor: statusColors.failed.bg,  icon: <ErrorOutlined sx={{ fontSize: 16 }} /> },
};

interface Props {
  status: ExecutionStatus;
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const { label, color, bgcolor, icon } = STATUS_CONFIG[status];

  return (
    <Chip
      icon={<Box sx={{ color, display: "flex", alignItems: "center" }}>{icon}</Box>}
      label={label}
      size="small"
      sx={{
        color,
        bgcolor,
        fontWeight: 600,
        fontSize: "0.75rem",
        // Subtle pulse animation while running
        ...(status === "running" && {
          animation: "pulse 1.5s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0.6 },
          },
        }),
      }}
    />
  );
};
