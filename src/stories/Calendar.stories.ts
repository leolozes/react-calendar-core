import type { Meta, StoryObj } from '@storybook/react';

import Calendar from "./Calendar";
import { types } from "../calendar";

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
    dragAction: {
      options: [...Object.values(types.DragAction)],
      control: { type: 'select' },
    }
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary: Story = {
  args: {
    allowPreviousNavigation: true,
    allowPreviousSelection: false,
    allowRangeSelection: false,
    dragAction: types.DragAction.Add,
    numberOfMonths: 1,
    orientation: "column",
    styled: true,
    width: 500
  },
};

export const Secondary: Story = {
  args: {
    allowPreviousNavigation: false,
    allowPreviousSelection: false,
    allowRangeSelection: true,
    dragAction: types.DragAction.None,
    numberOfMonths: 2,
    orientation: "column",
    styled: true,
    width: 500
  },
};