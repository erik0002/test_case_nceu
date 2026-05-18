import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { renderWithProviders } from '../../test/test-utils';

describe('DeleteConfirmModal', () => {
  const defaultProps = {
    open: true,
    title: 'Тестовая задача',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it('renders task title in confirmation message', () => {
    renderWithProviders(<DeleteConfirmModal {...defaultProps} />);
    expect(screen.getByText(/Тестовая задача/)).toBeInTheDocument();
    expect(screen.getByText('Удалить задачу?')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderWithProviders(<DeleteConfirmModal {...defaultProps} onCancel={onCancel} />);
    await user.click(screen.getByRole('button', { name: 'Отмена' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('calls onConfirm when delete button clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    renderWithProviders(<DeleteConfirmModal {...defaultProps} onConfirm={onConfirm} />);
    await user.click(screen.getByRole('button', { name: 'Удалить' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('does not render when closed', () => {
    renderWithProviders(<DeleteConfirmModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Удалить задачу?')).not.toBeInTheDocument();
  });

  it('disables buttons when loading', () => {
    renderWithProviders(<DeleteConfirmModal {...defaultProps} loading />);
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Удалить' })).toBeDisabled();
  });
});
