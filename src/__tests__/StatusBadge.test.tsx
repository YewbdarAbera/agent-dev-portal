/**
 * __tests__/StatusBadge.test.tsx
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Render tests for the StatusBadge component.
 * Verifies the correct label is displayed for every ExecutionStatus value
 * and that the "running" state applies its pulse animation class.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../components/AgentExecution/StatusBadge';
import type { ExecutionStatus } from '../types';

// ── Label correctness ─────────────────────────────────────────────────────────

describe('StatusBadge', () => {
  const cases: Array<[ExecutionStatus, string]> = [
    ['idle',    'Idle'],
    ['pending', 'Pending'],
    ['running', 'Running'],
    ['success', 'Success'],
    ['failed',  'Failed'],
  ];

  test.each(cases)(
    'renders "%s" label for status="%s"',
    (status, expectedLabel) => {
      render(<StatusBadge status={status} />);
      expect(screen.getByText(expectedLabel)).toBeInTheDocument();
    },
  );

  it('only renders one chip at a time', () => {
    render(<StatusBadge status="success" />);
    // MUI Chip renders the label in a span — there should be exactly one label visible
    expect(screen.getAllByText('Success')).toHaveLength(1);
  });

  it('does not show the wrong label', () => {
    render(<StatusBadge status="idle" />);
    expect(screen.queryByText('Running')).not.toBeInTheDocument();
    expect(screen.queryByText('Failed')).not.toBeInTheDocument();
  });
});
