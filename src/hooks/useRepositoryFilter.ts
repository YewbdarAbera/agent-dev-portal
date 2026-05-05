/**
 * hooks/useRepositoryFilter.ts
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Handles search text + language filter for the repo list.
 * Kept separate so the list component stays simple and easy to read.
 */

import { useState, useMemo } from "react";
import type { Repository, Language } from "../types";

export function useRepositoryFilter(repos: Repository[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language | "All">("All");

  // Re-compute only when the source list, query, or language changes
  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLanguage =
        selectedLanguage === "All" || repo.language === selectedLanguage;

      return matchesSearch && matchesLanguage;
    });
  }, [repos, searchQuery, selectedLanguage]);

  // Derive the unique language list from the data so it stays in sync
  const availableLanguages: Array<Language | "All"> = useMemo(() => {
    const langs = Array.from(new Set(repos.map((r) => r.language)));
    return ["All", ...langs];
  }, [repos]);

  return {
    searchQuery,
    setSearchQuery,
    selectedLanguage,
    setSelectedLanguage,
    filteredRepos,
    availableLanguages,
  };
}
