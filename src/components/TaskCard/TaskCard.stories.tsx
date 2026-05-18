import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TaskCard } from './TaskCard';
import { mockTask, mockOverdueTask } from '../../test/fixtures';

const meta: Meta<typeof TaskCard> = {
  title: 'Components/TaskCard',
  component: TaskCard,
  args: {
    onStatusChange: fn(),
    onTagClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

export const Default: Story = {
  args: { task: mockTask },
};

export const Overdue: Story = {
  args: { task: mockOverdueTask },
};

export const WithoutDescription: Story = {
  args: {
    task: { ...mockTask, description: undefined },
  },
};

export const Done: Story = {
  args: {
    task: { ...mockOverdueTask, status: 'done' },
  },
};
