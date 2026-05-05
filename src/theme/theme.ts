/**
 * theme/theme.ts
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Dark MUI theme. Keeping it in one file means design tokens
 * are easy to hand off or swap without touching components.
 */

import { createTheme } from "@mui/material/styles";

// Extend MUI's TypeBackground so `bgcolor: "background.terminal"` is type-safe
declare module "@mui/material/styles" {
  interface TypeBackground {
    terminal: string;
  }
}

// ─── Design tokens ───────────────────────────────────────────────────────────
// All rgba color values live here. Import these in components instead of
// repeating raw rgba() strings.

/** White-over-dark surface and border overlays */
export const overlay = {
  faint:   "rgba(255,255,255,0.02)", // barely-there surface (default task card)
  subtle:  "rgba(255,255,255,0.03)", // slightly raised surface (info boxes, stat tiles)
  soft:    "rgba(255,255,255,0.06)", // visible surface or tight border (badges, progress track)
  border:  "rgba(255,255,255,0.07)", // panel divider borders
  divider: "rgba(255,255,255,0.08)", // matches theme.palette.divider
  ghost:   "rgba(255,255,255,0.10)", // placeholder / disabled icons
} as const;

/** Primary (indigo #6366f1) alpha tints for interactive states */
export const primaryTint = {
  hover:    "rgba(99,102,241,0.05)", // card hover
  hoverAlt: "rgba(99,102,241,0.06)", // task card hover
  selected: "rgba(99,102,241,0.08)", // selected card background
  strong:   "rgba(99,102,241,0.12)", // selected task card background
  chip:     "rgba(99,102,241,0.15)", // topic chip background
} as const;

/** Colors specific to terminal/log output surfaces */
export const logColors = {
  timestamp: "#475569", // dim slate — de-emphasizes the clock against the message
  message:   "#cbd5e1", // softer than text.primary — body text in terminal lines
  info:      "#94a3b8", // = text.secondary
  warn:      "#fbbf24", // = warning.main
  error:     "#f87171", // = error.main
  success:   "#34d399", // = success.main
} as const;

/** Per-status text color and background tint */
export const statusColors = {
  idle:    { text: "#94a3b8", bg: "rgba(148,163,184,0.10)" },
  pending: { text: "#fbbf24", bg: "rgba(251,191,36,0.12)"  },
  running: { text: "#38bdf8", bg: "rgba(56,189,248,0.12)"  },
  success: { text: "#34d399", bg: "rgba(52,211,153,0.12)"  },
  failed:  { text: "#f87171", bg: "rgba(248,113,113,0.12)" },
} as const;

// ─────────────────────────────────────────────────────────────────────────────

export const appTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366f1",      // indigo — used for CTAs and selected states
      light: "#818cf8",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#22d3ee",      // cyan — accent for status indicators
    },
    error: {
      main: "#f87171",
    },
    warning: {
      main: "#fbbf24",
    },
    success: {
      main: "#34d399",
    },
    background: {
      default: "#0f1117",
      paper: "#1a1d27",
      terminal: "#0d1117", // deep black used for log/terminal surfaces
    },
    text: {
      primary: "#e2e8f0",
      secondary: "#94a3b8",
    },
    divider: overlay.divider,
  },
  typography: {
    fontFamily: "'Roboto', 'Inter', 'Segoe UI', sans-serif",
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle2: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${overlay.border}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
  },
});
