import type { Tag, Task, TaskFilters } from '../types';

export const mockTask: Task = {
  id: '1',
  title: 'Тестовая задача для проверки',
  description: 'Описание тестовой задачи',
  status: 'todo',
  priority: 'high',
  deadline: '2026-12-31',
  tags: ['react', 'testing'],
  createdAt: '2026-05-01T10:00:00.000Z',
  updatedAt: '2026-05-01T10:00:00.000Z',
};

export const mockOverdueTask: Task = {
  ...mockTask,
  id: '2',
  title: 'Просроченная задача',
  deadline: '2020-01-01',
  status: 'inProgress',
};

export const mockTags: Tag[] = [
  { id: '1', name: 'react' },
  { id: '2', name: 'testing' },
  { id: '3', name: 'frontend' },
];

export const defaultFilters: TaskFilters = {
  status: '',
  priority: '',
  tag: '',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
};
