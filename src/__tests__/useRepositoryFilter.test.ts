/**
 * __tests__/useRepositoryFilter.test.ts
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Unit tests for the useRepositoryFilter hook.
 * Covers: name search, description search, case-insensitivity,
 * language filtering, combined filters, and derived language list.
 */

import { renderHook, act } from '@testing-library/react';
import { useRepositoryFilter } from '../hooks/useRepositoryFilter';
import type { Repository } from '../types';

// ── Minimal fixture data ──────────────────────────────────────────────────────

const base: Omit<Repository, 'id' | 'name' | 'description' | 'language'> = {
  stars: 0, forks: 0, openIssues: 0, openPRs: 0,
  lastCommit: '2026-01-01T00:00:00Z', defaultBranch: 'main',
  visibility: 'private', owner: 'test', topics: [], coverage: 80, healthScore: 85,
};

const REPOS: Repository[] = [
  { ...base, id: 'r1', name: 'payment-service',   description: 'Handles all billing',  language: 'TypeScript' },
  { ...base, id: 'r2', name: 'auth-gateway',       description: 'JWT auth service',     language: 'Go'         },
  { ...base, id: 'r3', name: 'data-pipeline',      description: 'ETL for analytics',    language: 'Python'     },
  { ...base, id: 'r4', name: 'frontend-shell',     description: 'React micro-frontend', language: 'TypeScript' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function setup() {
  return renderHook(() => useRepositoryFilter(REPOS));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useRepositoryFilter', () => {
  describe('initial state', () => {
    it('returns all repos when query is empty and language is "All"', () => {
      const { result } = setup();
      expect(result.current.filteredRepos).toHaveLength(4);
    });

    it('sets searchQuery to empty string', () => {
      const { result } = setup();
      expect(result.current.searchQuery).toBe('');
    });

    it('sets selectedLanguage to "All"', () => {
      const { result } = setup();
      expect(result.current.selectedLanguage).toBe('All');
    });

    it('derives available languages from the data plus "All"', () => {
      const { result } = setup();
      expect(result.current.availableLanguages).toContain('All');
      expect(result.current.availableLanguages).toContain('TypeScript');
      expect(result.current.availableLanguages).toContain('Go');
      expect(result.current.availableLanguages).toContain('Python');
      expect(result.current.availableLanguages[0]).toBe('All');
    });

    it('does not contain duplicate languages', () => {
      const { result } = setup();
      const langs = result.current.availableLanguages;
      expect(langs.length).toBe(new Set(langs).size);
    });
  });

  describe('search filtering', () => {
    it('filters by repo name', () => {
      const { result } = setup();
      act(() => { result.current.setSearchQuery('payment'); });
      expect(result.current.filteredRepos).toHaveLength(1);
      expect(result.current.filteredRepos[0].id).toBe('r1');
    });

    it('filters by description', () => {
      const { result } = setup();
      act(() => { result.current.setSearchQuery('ETL'); });
      expect(result.current.filteredRepos).toHaveLength(1);
      expect(result.current.filteredRepos[0].id).toBe('r3');
    });

    it('is case-insensitive on name', () => {
      const { result } = setup();
      act(() => { result.current.setSearchQuery('AUTH'); });
      expect(result.current.filteredRepos).toHaveLength(1);
      expect(result.current.filteredRepos[0].id).toBe('r2');
    });

    it('is case-insensitive on description', () => {
      const { result } = setup();
      act(() => { result.current.setSearchQuery('react'); });
      expect(result.current.filteredRepos).toHaveLength(1);
      expect(result.current.filteredRepos[0].id).toBe('r4');
    });

    it('returns an empty array when nothing matches', () => {
      const { result } = setup();
      act(() => { result.current.setSearchQuery('zzz-no-match'); });
      expect(result.current.filteredRepos).toHaveLength(0);
    });

    it('returns all repos when query is cleared', () => {
      const { result } = setup();
      act(() => { result.current.setSearchQuery('payment'); });
      act(() => { result.current.setSearchQuery(''); });
      expect(result.current.filteredRepos).toHaveLength(4);
    });
  });

  describe('language filtering', () => {
    it('filters to only TypeScript repos', () => {
      const { result } = setup();
      act(() => { result.current.setSelectedLanguage('TypeScript'); });
      expect(result.current.filteredRepos).toHaveLength(2);
      result.current.filteredRepos.forEach((r) =>
        expect(r.language).toBe('TypeScript'),
      );
    });

    it('filters to only Go repos', () => {
      const { result } = setup();
      act(() => { result.current.setSelectedLanguage('Go'); });
      expect(result.current.filteredRepos).toHaveLength(1);
      expect(result.current.filteredRepos[0].id).toBe('r2');
    });

    it('"All" shows every repo', () => {
      const { result } = setup();
      act(() => { result.current.setSelectedLanguage('TypeScript'); });
      act(() => { result.current.setSelectedLanguage('All'); });
      expect(result.current.filteredRepos).toHaveLength(4);
    });
  });

  describe('combined search + language filter', () => {
    it('applies both search and language simultaneously', () => {
      const { result } = setup();
      act(() => {
        result.current.setSearchQuery('frontend');
        result.current.setSelectedLanguage('TypeScript');
      });
      expect(result.current.filteredRepos).toHaveLength(1);
      expect(result.current.filteredRepos[0].id).toBe('r4');
    });

    it('returns empty when search matches but language does not', () => {
      const { result } = setup();
      act(() => {
        result.current.setSearchQuery('data-pipeline');
        result.current.setSelectedLanguage('Go');
      });
      expect(result.current.filteredRepos).toHaveLength(0);
    });
  });
});
