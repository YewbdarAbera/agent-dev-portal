/**
 * components/AgentExecution/LogLine.tsx
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * A single line in the streaming log panel.
 * Color-coded by level so developers can scan quickly.
 * If the entry carries a `diff` payload, an inline diff card is
 * rendered below the message — used by AI Code Review and Refactor.
 */

import React from "react";
import { Box, Typography } from "@mui/material";
import type { CodeDiff, LogEntry } from "../../types";
import { logColors } from "../../theme/theme";
import dayjs from "dayjs";

const LEVEL_COLORS: Record<LogEntry["level"], string> = {
  info:    logColors.info,
  warn:    logColors.warn,
  error:   logColors.error,
  success: logColors.success,
};

const LEVEL_PREFIXES: Record<LogEntry["level"], string> = {
  info:    "INFO ",
  warn:    "WARN ",
  error:   "ERR  ",
  success: "OK   ",
};

interface Props {
  entry: LogEntry;
}

export const LogLine: React.FC<Props> = ({ entry }) => {
  const color = LEVEL_COLORS[entry.level];
  const prefix = LEVEL_PREFIXES[entry.level];

  return (
    <Box sx={{ fontFamily: "monospace", fontSize: "0.78rem", lineHeight: 1.6 }}>
      <Box className="flex items-start gap-2">
        <Typography component="span" sx={{ color: logColors.timestamp, flexShrink: 0, fontSize: "0.72rem" }}>
          {dayjs(entry.timestamp).format("HH:mm:ss")}
        </Typography>
        <Typography component="span" sx={{ color, flexShrink: 0, fontWeight: 700 }}>
          {prefix}
        </Typography>
        <Typography component="span" sx={{ color: logColors.message }}>
          {entry.message}
        </Typography>
      </Box>

      {entry.diff && <DiffSnippet diff={entry.diff} />}
    </Box>
  );
};

// ─── Inline diff card ────────────────────────────────────────────────────────

const DiffSnippet: React.FC<{ diff: CodeDiff }> = ({ diff }) => {
  const startLine = diff.startLine ?? 1;
  let cursor = startLine;
  const deletionRows = diff.deletions.map((line) => ({ kind: "del" as const, lineNo: cursor++, text: line }));
  cursor = startLine;
  const additionRows = diff.additions.map((line) => ({ kind: "add" as const, lineNo: cursor++, text: line }));

  return (
    <Box
      sx={{
        mt: 0.75,
        mb: 0.5,
        ml: 9,
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "rgba(255,255,255,0.015)",
      }}
    >
      {/* File path header */}
      <Box
        sx={{
          px: 1.25,
          py: 0.5,
          bgcolor: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          fontSize: "0.7rem",
          color: logColors.info,
          fontFamily: "monospace",
        }}
      >
        {diff.file}
        {diff.startLine !== undefined && (
          <Typography component="span" sx={{ ml: 1, color: logColors.timestamp, fontSize: "0.7rem" }}>
            @@ line {diff.startLine}
          </Typography>
        )}
      </Box>

      {/* Diff body */}
      <Box sx={{ py: 0.25 }}>
        {[...deletionRows, ...additionRows].map((row, i) => (
          <Box
            key={i}
            sx={{
              display: "grid",
              gridTemplateColumns: "44px 16px 1fr",
              alignItems: "start",
              fontSize: "0.74rem",
              fontFamily: "monospace",
              bgcolor: row.kind === "add"
                ? "rgba(52,211,153,0.08)"
                : "rgba(248,113,113,0.08)",
            }}
          >
            <Box sx={{ color: logColors.timestamp, textAlign: "right", pr: 1, userSelect: "none" }}>
              {row.lineNo}
            </Box>
            <Box
              sx={{
                color: row.kind === "add" ? logColors.success : logColors.error,
                fontWeight: 700,
                userSelect: "none",
              }}
            >
              {row.kind === "add" ? "+" : "−"}
            </Box>
            <Box sx={{ color: logColors.message, whiteSpace: "pre-wrap", pr: 1 }}>
              {row.text}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Optional caption */}
      {diff.note && (
        <Box
          sx={{
            px: 1.25,
            py: 0.5,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            fontSize: "0.7rem",
            color: logColors.info,
            fontStyle: "italic",
          }}
        >
          {diff.note}
        </Box>
      )}
    </Box>
  );
};
