/**
 * components/RepositoryList/RepositoryList.tsx
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Left panel — renders the search bar and the scrollable list of repo cards.
 * This component is intentionally thin; heavy logic lives in the hook.
 */

import React from "react";
import { Box, Typography } from "@mui/material";
import { FolderOpen as FolderOpenIcon } from "@mui/icons-material";
import type { Repository } from "../../types";
import { RepositoryCard } from "./RepositoryCard";
import { SearchFilter } from "./SearchFilter";
import { useRepositoryFilter } from "../../hooks/useRepositoryFilter";
import { MOCK_REPOSITORIES } from "../../mocks/repositories";
import { overlay } from "../../theme/theme";

interface Props {
  selectedRepo: Repository | null;
  onRepoSelect: (repo: Repository) => void;
}

export const RepositoryList: React.FC<Props> = ({ selectedRepo, onRepoSelect }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedLanguage,
    setSelectedLanguage,
    filteredRepos,
    availableLanguages,
  } = useRepositoryFilter(MOCK_REPOSITORIES);

  return (
    <Box className="flex flex-col h-full">
      {/* Header */}
      <Box className="flex items-center gap-2 mb-4">
        <FolderOpenIcon sx={{ color: "primary.main" }} />
        <Typography variant="h6">Repositories</Typography>
        <Typography
          variant="caption"
          sx={{ ml: "auto", color: "text.secondary", bgcolor: overlay.soft, px: 1, py: 0.3, borderRadius: 1 }}
        >
          {filteredRepos.length} / {MOCK_REPOSITORIES.length}
        </Typography>
      </Box>

      {/* Search + Filter */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        availableLanguages={availableLanguages}
      />

      {/* Scrollable repo list */}
      <Box
        className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1"
        sx={{ scrollbarWidth: "thin" }}
      >
        {filteredRepos.length === 0 ? (
          <Typography variant="body2" color="text.secondary" className="text-center mt-8">
            No repositories match your search.
          </Typography>
        ) : (
          filteredRepos.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repo={repo}
              isSelected={selectedRepo?.id === repo.id}
              onSelect={onRepoSelect}
            />
          ))
        )}
      </Box>
    </Box>
  );
};
