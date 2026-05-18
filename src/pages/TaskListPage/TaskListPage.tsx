import { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Pagination,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { TaskCard } from '../../components/TaskCard/TaskCard';
import { TaskFilters } from '../../components/TaskFilters/TaskFilters';
import { useGetTasksQuery, useUpdateTaskStatusMutation } from '../../store/api/tasksApi';
import type { TaskFilters as TaskFiltersType, TaskStatus } from '../../types';
import { PAGE_SIZE } from '../../utils/constants';

const defaultFilters: TaskFiltersType = {
  status: '',
  priority: '',
  tag: '',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: PAGE_SIZE,
};

export function TaskListPage() {
  const [filters, setFilters] = useState<TaskFiltersType>(defaultFilters);
  const [updateStatus] = useUpdateTaskStatusMutation();

  const queryFilters = useMemo(
    () => ({
      status: filters.status || undefined,
      priority: filters.priority || undefined,
      search: filters.search || undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }),
    [filters.status, filters.priority, filters.search, filters.sortBy, filters.sortOrder]
  );

  const { data: fetchedTasks = [], isLoading, isError } = useGetTasksQuery(queryFilters);

  const allTasks = useMemo(() => {
    if (!filters.tag) return fetchedTasks;
    return fetchedTasks.filter((task) => task.tags.includes(filters.tag!));
  }, [fetchedTasks, filters.tag]);

  const totalPages = Math.max(1, Math.ceil(allTasks.length / PAGE_SIZE));
  const currentPage = filters.page ?? 1;
  const paginatedTasks = allTasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    await updateStatus({ id, status });
  };

  const handleTagClick = (tag: string) => {
    setFilters((prev) => ({ ...prev, tag, page: 1 }));
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Задачи
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Всего: {allTasks.length}
        </Typography>
      </Box>

      <TaskFilters filters={filters} onChange={setFilters} />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Не удалось загрузить задачи. Убедитесь, что JSON Server запущен.
        </Alert>
      )}

      {!isLoading && !isError && paginatedTasks.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary" gutterBottom>
            Задачи не найдены
          </Typography>
          <Button component={RouterLink} to="/tasks/new" variant="contained">
            Создать первую задачу
          </Button>
        </Box>
      )}

      {!isLoading && paginatedTasks.length > 0 && (
        <>
          <Grid container spacing={2}>
            {paginatedTasks.map((task) => (
              <Grid key={task.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <TaskCard
                  task={task}
                  onStatusChange={handleStatusChange}
                  onTagClick={handleTagClick}
                />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
