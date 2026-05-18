import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { TaskFilters } from './TaskFilters';
import { renderWithProviders } from '../../test/test-utils';
import { defaultFilters } from '../../test/fixtures';
import type { TaskFilters as TaskFiltersType } from '../../types';

function TaskFiltersHarness() {
  const [filters, setFilters] = useState<TaskFiltersType>(defaultFilters);
  return <TaskFilters filters={filters} onChange={setFilters} />;
}

describe('TaskFilters', () => {
  it('renders filter controls', () => {
    renderWithProviders(<TaskFiltersHarness />);
    expect(screen.getByLabelText('Поиск по названию')).toBeInTheDocument();
    expect(screen.getByLabelText('Тег')).toBeInTheDocument();
    expect(screen.getByText('Фильтры и сортировка')).toBeInTheDocument();
    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(2);
  });

  it('updates search filter on input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskFiltersHarness />);
    const searchInput = screen.getByLabelText('Поиск по названию');
    await user.type(searchInput, 'react');
    expect(searchInput).toHaveValue('react');
  });

  it('shows active tag filter hint', () => {
    renderWithProviders(
      <TaskFilters
        filters={{ ...defaultFilters, tag: 'frontend' }}
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText(/frontend/)).toBeInTheDocument();
    expect(screen.getByText(/Активный фильтр по тегу/)).toBeInTheDocument();
  });
});
