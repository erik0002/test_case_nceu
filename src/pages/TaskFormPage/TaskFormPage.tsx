import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TaskForm } from '../../components/TaskForm/TaskForm';
import {
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from '../../store/api/tasksApi';
import type { TaskFormSchema } from '../../schemas/taskSchema';

export function TaskFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: task, isLoading: loadingTask, isError } = useGetTaskByIdQuery(id!, {
    skip: !isEdit,
  });
  const [createTask, { isLoading: creating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: updating }] = useUpdateTaskMutation();

  const handleSubmit = async (data: TaskFormSchema) => {
    const now = new Date().toISOString();

    if (isEdit && task) {
      await updateTask({
        ...task,
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        priority: data.priority,
        deadline: data.deadline,
        tags: data.tags,
        updatedAt: now,
      }).unwrap();
      navigate(`/task/${task.id}`);
    } else {
      const created = await createTask({
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        priority: data.priority,
        deadline: data.deadline,
        tags: data.tags,
        createdAt: now,
        updatedAt: now,
      }).unwrap();
      navigate(`/task/${created.id}`);
    }
  };

  if (isEdit && loadingTask) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isEdit && (isError || !task)) {
    return <Alert severity="error">Задача не найдена</Alert>;
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        component={RouterLink}
        to={isEdit ? `/task/${id}` : '/'}
        sx={{ mb: 2 }}
      >
        Назад
      </Button>
      <TaskForm
        initialData={task}
        onSubmit={handleSubmit}
        loading={creating || updating}
      />
    </Box>
  );
}
