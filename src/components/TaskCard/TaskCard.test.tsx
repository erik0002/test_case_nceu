import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskCard } from './TaskCard';
import { renderWithProviders } from '../../test/test-utils';
import { mockTask, mockOverdueTask } from '../../test/fixtures';

describe('TaskCard', () => {
  it('renders task title and description', () => {
    renderWithProviders(
      <TaskCard task={mockTask} onStatusChange={vi.fn()} onTagClick={vi.fn()} />
    );
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description!)).toBeInTheDocument();
  });

  it('renders tags', () => {
    renderWithProviders(
      <TaskCard task={mockTask} onStatusChange={vi.fn()} onTagClick={vi.fn()} />
    );
    mockTask.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('shows overdue warning for past deadline', () => {
    renderWithProviders(
      <TaskCard task={mockOverdueTask} onStatusChange={vi.fn()} onTagClick={vi.fn()} />
    );
    expect(screen.getByText(/Просрочено/)).toBeInTheDocument();
  });

  it('calls onTagClick when tag is clicked', async () => {
    const user = userEvent.setup();
    const onTagClick = vi.fn();
    renderWithProviders(
      <TaskCard task={mockTask} onStatusChange={vi.fn()} onTagClick={onTagClick} />
    );
    await user.click(screen.getByText('react'));
    expect(onTagClick).toHaveBeenCalledWith('react');
  });
});
