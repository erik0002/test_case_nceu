import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Task, TaskFilters, TaskStatus } from '../../types';
import { API_BASE } from '../../utils/constants';

interface PaginatedTasksResponse {
  data: Task[];
  items: number;
  pages: number;
}

export function normalizeTasksResponse(response: Task[] | PaginatedTasksResponse): Task[] {
  if (Array.isArray(response)) return response;
  return response.data ?? [];
}

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE }),
  tagTypes: ['Task', 'TaskList'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], TaskFilters>({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters.status) params.set('status', filters.status);
        if (filters.priority) params.set('priority', filters.priority);
        if (filters.search) params.set('title:contains', filters.search);

        const sortField = filters.sortBy ?? 'createdAt';
        const sortOrder = filters.sortOrder ?? 'desc';
        params.set('_sort', sortOrder === 'desc' ? `-${sortField}` : sortField);

        return `/tasks?${params.toString()}`;
      },
      transformResponse: normalizeTasksResponse,
      providesTags: (result) => {
        const tasks = result ?? [];
        return [
          ...tasks.map(({ id }) => ({ type: 'Task' as const, id })),
          { type: 'TaskList', id: 'LIST' },
        ];
      },
    }),

    getTaskById: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Task', id }],
    }),

    createTask: builder.mutation<Task, Omit<Task, 'id'>>({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'TaskList', id: 'LIST' }],
    }),

    updateTask: builder.mutation<Task, Task>({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: { id, ...body },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Task', id },
        { type: 'TaskList', id: 'LIST' },
      ],
    }),

    updateTaskStatus: builder.mutation<Task, { id: string; status: TaskStatus }>({
      query: ({ id, status }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: { status, updatedAt: new Date().toISOString() },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Task', id },
        { type: 'TaskList', id: 'LIST' },
      ],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Task', id },
        { type: 'TaskList', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} = tasksApi;
