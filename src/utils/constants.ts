import type { TaskPriority, TaskStatus } from '../types';

export const API_BASE = '/api';

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'К выполнению' },
  { value: 'inProgress', label: 'В работе' },
  { value: 'done', label: 'Выполнено' },
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Низкий', color: '#4caf50' },
  { value: 'medium', label: 'Средний', color: '#ff9800' },
  { value: 'high', label: 'Высокий', color: '#f44336' },
];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'К выполнению',
  inProgress: 'В работе',
  done: 'Выполнено',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

export const PAGE_SIZE = 6;
