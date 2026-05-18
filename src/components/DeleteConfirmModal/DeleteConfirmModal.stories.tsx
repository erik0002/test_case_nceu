import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DeleteConfirmModal } from './DeleteConfirmModal';

const meta: Meta<typeof DeleteConfirmModal> = {
  title: 'Components/DeleteConfirmModal',
  component: DeleteConfirmModal,
  args: {
    open: true,
    title: 'Настроить окружение разработки',
    onConfirm: fn(),
    onCancel: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DeleteConfirmModal>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

export const Closed: Story = {
  args: { open: false },
};
