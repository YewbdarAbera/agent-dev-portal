/**
 * components/RepositoryList/LanguageBadge.tsx
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Small colored dot + label for programming languages.
 * Colors match the GitHub language palette so it feels familiar.
 */

import React from "react";
import { Box, Typography } from "@mui/material";
import type { Language } from "../../types";

const LANGUAGE_COLORS: Record<Language, string> = {
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Go: "#00ADD8",
  Java: "#b07219",
  Rust: "#dea584",
  JavaScript: "#f1e05a",
};

interface Props {
  language: Language;
}

export const LanguageBadge: React.FC<Props> = ({ language }) => {
  const color = LANGUAGE_COLORS[language] ?? "#888";

  return (
    <Box className="flex items-center gap-1">
      <Box
        component="span"
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: color,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      <Typography variant="caption" color="text.secondary">
        {language}
      </Typography>
    </Box>
  );
};
