import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TaskFilters } from './TaskFilters';
import { defaultFilters } from '../../test/fixtures';

const meta: Meta<typeof TaskFilters> = {
  title: 'Components/TaskFilters',
  component: TaskFilters,
  args: {
    filters: defaultFilters,
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof TaskFilters>;

export const Default: Story = {};

export const WithActiveTag: Story = {
  args: {
    filters: { ...defaultFilters, tag: 'react' },
  },
};

export const WithSearch: Story = {
  args: {
    filters: { ...defaultFilters, search: 'окружение' },
  },
};
