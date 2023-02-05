import type { Meta, StoryObj } from '@storybook/react';

import { addDays } from "date-fns";

import Calendar from "./Calendar";
import { types } from "../calendar";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Example/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    allowPreviousSelection: {
      options: [...Object.values(types.AllowPreviousSelection)],
      control: { type: 'select' },
    },
    orientation: {
      options: ['row', 'column'],
      control: { type: 'radio' },
    },
    dragAction: {
      options: [...Object.values(types.DragAction)],
      control: { type: 'select' },
    },
    startDate: {
      control: { type: 'date' },
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary: Story = {
  args: {
    allowPreviousNavigation: true,
    allowPreviousSelection: types.AllowPreviousSelection.AfterToday,
    allowRangeSelection: false,
    dragAction: types.DragAction.Add,
    numberOfMonths: 1,
    orientation: "column",
    startDate: Date.now(),
    styled: true,
    width: 500
  },
};

export const Secondary: Story = {
  args: {
    allowPreviousNavigation: false,
    allowPreviousSelection: types.AllowPreviousSelection.AfterStartDate,
    allowRangeSelection: true,
    dragAction: types.DragAction.None,
    numberOfMonths: 2,
    orientation: "column",
    startDate: addDays(Date.now(), 15).getTime(),
    styled: true,
    width: 500
  },
};