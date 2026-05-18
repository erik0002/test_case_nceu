import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip,
  Box,
  Select,
  MenuItem,
  FormControl,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Task, TaskStatus } from '../../types';
import { STATUS_LABELS, PRIORITY_LABELS, TASK_PRIORITIES } from '../../utils/constants';
import { formatDate, isOverdue } from '../../utils/date';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onTagClick: (tag: string) => void;
}

export function TaskCard({ task, onStatusChange, onTagClick }: TaskCardProps) {
  const navigate = useNavigate();
  const overdue = isOverdue(task.deadline, task.status);
  const priorityColor = TASK_PRIORITIES.find((p) => p.value === task.priority)?.color ?? '#999';

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    e.preventDefault();
    onTagClick(tag);
  };

  return (
    <Card
      className={`${styles.card} ${overdue ? styles.overdue : ''}`}
      elevation={overdue ? 4 : 1}
    >
      <CardActionArea onClick={() => navigate(`/task/${task.id}`)}>
        <CardContent>
          <Box className={styles.header}>
            <Typography variant="h6" component="h2" className={styles.title}>
              {task.title}
            </Typography>
            <FormControl size="small" onClick={handleStatusClick}>
              <Select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                onClick={handleStatusClick}
                className={styles.statusSelect}
                sx={{ minWidth: 130, fontSize: '0.85rem' }}
              >
                <MenuItem value="todo">К выполнению</MenuItem>
                <MenuItem value="inProgress">В работе</MenuItem>
                <MenuItem value="done">Выполнено</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {task.description && (
            <Typography variant="body2" color="text.secondary" className={styles.description}>
              {task.description}
            </Typography>
          )}

          <Stack direction="row" spacing={1} sx={{ mt: 1.5, mb: 1, alignItems: 'center' }}>
            <Chip
              label={PRIORITY_LABELS[task.priority]}
              size="small"
              sx={{ bgcolor: priorityColor, color: 'white', fontWeight: 600 }}
            />
            <Chip label={STATUS_LABELS[task.status]} size="small" variant="outlined" />
            <Typography
              variant="caption"
              className={overdue ? styles.deadlineOverdue : styles.deadline}
            >
              {overdue ? '⚠ Просрочено: ' : 'Дедлайн: '}
              {formatDate(task.deadline)}
            </Typography>
          </Stack>

          <Box className={styles.tags} onClick={(e) => e.stopPropagation()}>
            {task.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                onClick={(e) => handleTagClick(e, tag)}
                className={styles.tag}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
