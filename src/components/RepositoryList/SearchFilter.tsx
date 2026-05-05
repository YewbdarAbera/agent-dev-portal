/**
 * components/RepositoryList/SearchFilter.tsx
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Search box + language dropdown filter.
 * Purely controlled — state lives in the useRepositoryFilter hook.
 */

import React from "react";
import { Box, TextField, MenuItem, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import type { Language } from "../../types";

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedLanguage: Language | "All";
  onLanguageChange: (value: Language | "All") => void;
  availableLanguages: Array<Language | "All">;
}

export const SearchFilter: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  selectedLanguage,
  onLanguageChange,
  availableLanguages,
}) => {
  return (
    <Box className="flex gap-2 mb-3">
      <TextField
        fullWidth
        size="small"
        placeholder="Search repositories..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        select
        size="small"
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value as Language | "All")}
        sx={{ minWidth: 130 }}
      >
        {availableLanguages.map((lang) => (
          <MenuItem key={lang} value={lang}>
            {lang}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};
