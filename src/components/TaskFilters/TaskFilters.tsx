import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskFilters as TaskFiltersType } from '../../types';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../utils/constants';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onChange: (filters: TaskFiltersType) => void;
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const update = (patch: Partial<TaskFiltersType>) => {
    onChange({ ...filters, ...patch, page: 1 });
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'white', borderRadius: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Фильтры и сортировка
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            size="small"
            label="Поиск по названию"
            value={filters.search ?? ''}
            onChange={(e) => update({ search: e.target.value })}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Статус</InputLabel>
            <Select
              label="Статус"
              value={filters.status ?? ''}
              onChange={(e) => update({ status: e.target.value as TaskFiltersType['status'] })}
            >
              <MenuItem value="">Все</MenuItem>
              {TASK_STATUSES.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Приоритет</InputLabel>
            <Select
              label="Приоритет"
              value={filters.priority ?? ''}
              onChange={(e) => update({ priority: e.target.value as TaskFiltersType['priority'] })}
            >
              <MenuItem value="">Все</MenuItem>
              {TASK_PRIORITIES.map((p) => (
                <MenuItem key={p.value} value={p.value}>
                  {p.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Тег"
            value={filters.tag ?? ''}
            onChange={(e) => update({ tag: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Сортировка</InputLabel>
            <Select
              label="Сортировка"
              value={filters.sortBy ?? 'createdAt'}
              onChange={(e) =>
                update({ sortBy: e.target.value as TaskFiltersType['sortBy'] })
              }
            >
              <MenuItem value="createdAt">По дате создания</MenuItem>
              <MenuItem value="deadline">По дедлайну</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Порядок</InputLabel>
            <Select
              label="Порядок"
              value={filters.sortOrder ?? 'desc'}
              onChange={(e) =>
                update({ sortOrder: e.target.value as TaskFiltersType['sortOrder'] })
              }
            >
              <MenuItem value="desc">По убыванию</MenuItem>
              <MenuItem value="asc">По возрастанию</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {filters.tag && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="primary">
            Активный фильтр по тегу: <strong>{filters.tag}</strong>
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
