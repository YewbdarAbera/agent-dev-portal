/**
 * __tests__/useAgentExecution.test.ts
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Unit tests for the useAgentExecution hook.
 * Uses Jest fake timers to control the setTimeout (600ms start delay)
 * and setInterval (700ms per log line) without waiting in real time.
 */

import { renderHook, act } from '@testing-library/react';
import { useAgentExecution } from '../hooks/useAgentExecution';

// ── Mock streaming log data ───────────────────────────────────────────────────
// Controlled sequences let us assert exact log counts and final status
// without coupling tests to the real fixture file.

jest.mock('../mocks/streamingLogs', () => ({
  TASK_LOGS: {
    'create-pr': [
      { level: 'info',    message: 'Fetching commits...', timestamp: '' },
      { level: 'info',    message: 'Generating PR...',    timestamp: '' },
      { level: 'success', message: 'PR created.',         timestamp: '' },
    ],
    'run-tests': [
      { level: 'info',  message: 'Running tests...', timestamp: '' },
      { level: 'error', message: '2 tests failed.',  timestamp: '' },
    ],
    // Stubs for the remaining task types (not exercised in these tests)
    'refactor':         [],
    'dependency-scan':  [],
    'code-review':      [],
    'security-scan':    [],
  },
}));

// ── Constants (must match the hook's internal values) ─────────────────────────
const START_DELAY_MS = 600;
const LOG_INTERVAL_MS = 700;

// ── Helpers ───────────────────────────────────────────────────────────────────

function setup() {
  return renderHook(() => useAgentExecution());
}

function advanceToRunning() {
  jest.advanceTimersByTime(START_DELAY_MS);
}

function advanceLogs(count: number) {
  jest.advanceTimersByTime(LOG_INTERVAL_MS * count);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useAgentExecution', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('initial state', () => {
    it('starts with status "idle"', () => {
      const { result } = setup();
      expect(result.current.execution.status).toBe('idle');
    });

    it('has no logs', () => {
      const { result } = setup();
      expect(result.current.execution.logs).toHaveLength(0);
    });

    it('has null summary', () => {
      const { result } = setup();
      expect(result.current.execution.summary).toBeNull();
    });
  });

  describe('runTask — status transitions', () => {
    it('moves to "pending" immediately on runTask', () => {
      const { result } = setup();
      act(() => { result.current.runTask('create-pr'); });
      expect(result.current.execution.status).toBe('pending');
    });

    it('moves to "running" after the start delay', () => {
      const { result } = setup();
      act(() => { result.current.runTask('create-pr'); });
      act(() => { advanceToRunning(); });
      expect(result.current.execution.status).toBe('running');
    });

    it('sets startedAt when running begins', () => {
      const { result } = setup();
      act(() => { result.current.runTask('create-pr'); });
      act(() => { advanceToRunning(); });
      expect(result.current.execution.startedAt).not.toBeNull();
    });

    it('resolves to "success" when no error logs are present', () => {
      const { result } = setup();
      act(() => { result.current.runTask('create-pr'); });
      act(() => { advanceToRunning(); });
      // 3 log lines × 700ms + 1 extra tick to trigger final state
      act(() => { advanceLogs(4); });
      expect(result.current.execution.status).toBe('success');
    });

    it('resolves to "failed" when at least one log is level "error"', () => {
      const { result } = setup();
      act(() => { result.current.runTask('run-tests'); });
      act(() => { advanceToRunning(); });
      act(() => { advanceLogs(3); });
      expect(result.current.execution.status).toBe('failed');
    });

    it('sets finishedAt on completion', () => {
      const { result } = setup();
      act(() => { result.current.runTask('create-pr'); });
      act(() => { advanceToRunning(); });
      act(() => { advanceLogs(4); });
      expect(result.current.execution.finishedAt).not.toBeNull();
    });

    it('populates summary on success', () => {
      const { result } = setup();
      act(() => { result.current.runTask('create-pr'); });
      act(() => { advanceToRunning(); });
      act(() => { advanceLogs(4); });
      expect(result.current.execution.summary).toMatch(/successfully/i);
    });

    it('populates summary on failure', () => {
      const { result } = setup();
      act(() => { result.current.runTask('run-tests'); });
      act(() => { advanceToRunning(); });
      act(() => { advanceLogs(3); });
      expect(result.current.execution.summary).toMatch(/error/i);
    });
  });

  describe('runTask — log streaming', () => {
    it('appends one log entry per interval tick', () => {
      const { result } = setup();
      act(() => { result.current.runTask('create-pr'); });
      act(() => { advanceToRunning(); });

      act(() => { advanceLogs(1); });
      expect(result.current.execution.logs).toHaveLength(1);

      act(() => { advanceLogs(1); });
      expect(result.current.execution.logs).toHaveLength(2);
    });

    it('each log entry has id, timestamp, level, and message', () => {
      const { result } = setup();
      act(() => { result.current.runTask('create-pr'); });
      act(() => { advanceToRunning(); });
      act(() => { advanceLogs(1); });

      const entry = result.current.execution.logs[0];
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('timestamp');
      expect(entry).toHaveProperty('level');
      expect(entry).toHaveProperty('message');
    });

    it('stores the task type on the execution', () => {
      const { result } = setup();
      act(() => { result.current.runTask('create-pr'); });
      expect(result.current.execution.taskType).toBe('create-pr');
    });
  });

  describe('retry', () => {
    it('re-runs the same task that just completed', () => {
      const { result } = setup();
      act(() => { result.current.runTask('create-pr'); });
      act(() => { advanceToRunning(); });
      act(() => { advanceLogs(4); });

      act(() => { result.current.retry(); });
      expect(result.current.execution.status).toBe('pending');
      expect(result.current.execution.taskType).toBe('create-pr');
    });

    it('clears previous logs on retry', () => {
      const { result } = setup();
      act(() => { result.current.runTask('create-pr'); });
      act(() => { advanceToRunning(); });
      act(() => { advanceLogs(4); });

      act(() => { result.current.retry(); });
      expect(result.current.execution.logs).toHaveLength(0);
    });
  });

  describe('reset', () => {
    it('returns status to "idle"', () => {
      const { result } = setup();
      act(() => { result.current.runTask('create-pr'); });
      act(() => { advanceToRunning(); });
      act(() => { result.current.reset(); });
      expect(result.current.execution.status).toBe('idle');
    });

    it('clears logs', () => {
      const { result } = setup();
      act(() => { result.current.runTask('create-pr'); });
      act(() => { advanceToRunning(); });
      act(() => { advanceLogs(2); });
      act(() => { result.current.reset(); });
      expect(result.current.execution.logs).toHaveLength(0);
    });

    it('clears summary', () => {
      const { result } = setup();
      act(() => { result.current.runTask('create-pr'); });
      act(() => { advanceToRunning(); });
      act(() => { advanceLogs(4); });
      act(() => { result.current.reset(); });
      expect(result.current.execution.summary).toBeNull();
    });
  });
});
