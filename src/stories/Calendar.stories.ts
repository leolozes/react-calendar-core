import type { Meta, StoryObj } from '@storybook/react';

import Calendar from './Calendar';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Example/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      options: ['row', 'column'],
      control: { type: 'radio' },
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary: Story = {
  args: {
    numberOfMonths: 1,
    orientation: "column",
    styled: true,
    width: 500
  },
};

export const Secondary: Story = {
  args: {
    numberOfMonths: 2,
    orientation: "column",
    styled: true,
    width: 500
  },
};