import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Paper,
  Typography,
  FormHelperText,
  Autocomplete,
  Chip,
  CircularProgress,
} from '@mui/material';
import { taskFormSchema, type TaskFormSchema } from '../../schemas/taskSchema';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../utils/constants';
import { useGetTagsQuery, useCreateTagMutation } from '../../store/api/tagsApi';
import type { Task } from '../../types';

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: TaskFormSchema) => Promise<void>;
  loading?: boolean;
}

export function TaskForm({ initialData, onSubmit, loading = false }: TaskFormProps) {
  const { data: tags = [], isLoading: tagsLoading } = useGetTagsQuery();
  const [createTag] = useCreateTagMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TaskFormSchema>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      deadline: '',
      tags: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description ?? '',
        status: initialData.status,
        priority: initialData.priority,
        deadline: initialData.deadline,
        tags: initialData.tags,
      });
    }
  }, [initialData, reset]);

  const tagOptions = tags.map((t) => t.name);

  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', borderRadius: 2 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {initialData ? 'Редактирование задачи' : 'Новая задача'}
        </Typography>

        <TextField
          fullWidth
          label="Заголовок"
          margin="normal"
          {...register('title')}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <TextField
          fullWidth
          label="Описание"
          margin="normal"
          multiline
          rows={4}
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
          slotProps={{ htmlInput: { maxLength: 500 } }}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth margin="normal" error={!!errors.status}>
              <InputLabel>Статус</InputLabel>
              <Select {...field} label="Статус">
                {TASK_STATUSES.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.status?.message}</FormHelperText>
            </FormControl>
          )}
        />

        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <FormControl component="fieldset" margin="normal" error={!!errors.priority}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Приоритет
              </Typography>
              <RadioGroup row {...field}>
                {TASK_PRIORITIES.map((p) => (
                  <FormControlLabel
                    key={p.value}
                    value={p.value}
                    control={<Radio />}
                    label={p.label}
                  />
                ))}
              </RadioGroup>
              <FormHelperText>{errors.priority?.message}</FormHelperText>
            </FormControl>
          )}
        />

        <TextField
          fullWidth
          label="Дедлайн"
          type="date"
          margin="normal"
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('deadline')}
          error={!!errors.deadline}
          helperText={errors.deadline?.message}
        />

        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <Autocomplete
              multiple
              freeSolo
              options={tagOptions}
              value={field.value}
              onChange={async (_, newValue) => {
                const normalized = newValue.map((v) =>
                  typeof v === 'string' ? v.trim().toLowerCase() : v
                );
                const added = normalized.filter(
                  (name) => !tagOptions.includes(name) && name.length > 0
                );
                for (const name of added) {
                  try {
                    await createTag({ name }).unwrap();
                  } catch {
                    /* tag may already exist */
                  }
                }
                field.onChange(normalized);
              }}
              loading={tagsLoading}
              renderValue={(value, getItemProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    size="small"
                    {...getItemProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Теги"
                  margin="normal"
                  error={!!errors.tags}
                  helperText={errors.tags?.message ?? 'Минимум 1 тег. Можно добавить новый.'}
                />
              )}
            />
          )}
        />

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {initialData ? 'Сохранить' : 'Создать'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
