import { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGetTaskByIdQuery, useDeleteTaskMutation } from '../../store/api/tasksApi';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal/DeleteConfirmModal';
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  TASK_PRIORITIES,
} from '../../utils/constants';
import { formatDate, formatDateTime, isOverdue } from '../../utils/date';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: task, isLoading, isError } = useGetTaskByIdQuery(id!, { skip: !id });
  const [deleteTask, { isLoading: deleting }] = useDeleteTaskMutation();

  const handleDelete = async () => {
    if (!id) return;
    await deleteTask(id).unwrap();
    navigate('/');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !task) {
    return (
      <Alert severity="error">
        Задача не найдена.{' '}
        <Button component={RouterLink} to="/" size="small">
          Вернуться к списку
        </Button>
      </Alert>
    );
  }

  const overdue = isOverdue(task.deadline, task.status);
  const priorityColor = TASK_PRIORITIES.find((p) => p.value === task.priority)?.color;

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        component={RouterLink}
        to="/"
        sx={{ mb: 2 }}
      >
        Назад к списку
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          bgcolor: 'white',
          borderRadius: 2,
          borderLeft: overdue ? '4px solid #d32f2f' : '4px solid transparent',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {task.title}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              component={RouterLink}
              to={`/tasks/${task.id}/edit`}
            >
              Редактировать
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteOpen(true)}
            >
              Удалить
            </Button>
          </Stack>
        </Box>

        {overdue && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Задача просрочена! Дедлайн: {formatDate(task.deadline)}
          </Alert>
        )}

        {task.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {task.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Chip label={STATUS_LABELS[task.status]} color="primary" />
          <Chip
            label={PRIORITY_LABELS[task.priority]}
            sx={{ bgcolor: priorityColor, color: 'white' }}
          />
          <Chip
            label={`Дедлайн: ${formatDate(task.deadline)}`}
            variant="outlined"
            color={overdue ? 'error' : 'default'}
          />
        </Stack>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Теги
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {task.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" color="primary" />
            ))}
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={4}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Создано
            </Typography>
            <Typography variant="body2">{formatDateTime(task.createdAt)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Обновлено
            </Typography>
            <Typography variant="body2">{formatDateTime(task.updatedAt)}</Typography>
          </Box>
        </Stack>
      </Paper>

      <DeleteConfirmModal
        open={deleteOpen}
        title={task.title}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={deleting}
      />
    </Box>
  );
}
