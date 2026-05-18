import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isOverdue, formatDate, formatDateTime } from './date';

describe('isOverdue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true for past deadline with non-done status', () => {
    expect(isOverdue('2026-05-01', 'todo')).toBe(true);
    expect(isOverdue('2026-05-01', 'inProgress')).toBe(true);
  });

  it('returns false for future deadline', () => {
    expect(isOverdue('2026-06-01', 'todo')).toBe(false);
  });

  it('returns false for done tasks even if deadline passed', () => {
    expect(isOverdue('2020-01-01', 'done')).toBe(false);
  });

  it('returns false for today deadline', () => {
    expect(isOverdue('2026-05-15', 'todo')).toBe(false);
  });
});

describe('formatDate', () => {
  it('formats date in ru-RU locale', () => {
    expect(formatDate('2026-05-15')).toMatch(/15[./]05[./]2026/);
  });
});

describe('formatDateTime', () => {
  it('includes date and time parts', () => {
    const result = formatDateTime('2026-05-15T14:30:00');
    expect(result).toMatch(/15[./]05[./]2026/);
    expect(result).toMatch(/14/);
  });
});
