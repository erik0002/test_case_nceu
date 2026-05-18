import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TaskForm } from './TaskForm';
import { mockTask } from '../../test/fixtures';
import { WithMockTags } from '../../test/storybook-decorators';

const meta: Meta<typeof TaskForm> = {
  title: 'Components/TaskForm',
  component: TaskForm,
  decorators: [
    (Story) => (
      <WithMockTags>
        <Story />
      </WithMockTags>
    ),
  ],
  args: {
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof TaskForm>;

export const Create: Story = {};

export const Edit: Story = {
  args: {
    initialData: mockTask,
  },
};

export const Loading: Story = {
  args: {
    initialData: mockTask,
    loading: true,
  },
};
