import { describe, it, expect } from 'vitest';
import { normalizeTasksResponse } from './tasksApi';
import type { Task } from '../../types';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    status: 'todo',
    priority: 'low',
    deadline: '2026-06-01',
    tags: [],
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  },
];

describe('normalizeTasksResponse', () => {
  it('returns array as-is', () => {
    expect(normalizeTasksResponse(mockTasks)).toEqual(mockTasks);
  });

  it('extracts data from paginated response', () => {
    const paginated = {
      data: mockTasks,
      items: 1,
      pages: 1,
      first: 1,
      prev: null,
      next: null,
      last: 1,
    };
    expect(normalizeTasksResponse(paginated)).toEqual(mockTasks);
  });

  it('returns empty array for paginated response without data', () => {
    expect(normalizeTasksResponse({ data: [], items: 0, pages: 0 })).toEqual([]);
  });
});
