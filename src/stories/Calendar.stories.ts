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
    allowNavigation: {
      options: [...Object.values(types.AllowNavigation)],
      control: { type: 'select' },
    },
    allowSelection: {
      options: [...Object.values(types.AllowSelection)],
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
    allowNavigation: types.AllowNavigation.All,
    allowSelection: types.AllowSelection.All,
    allowRangeSelection: false,
    callOnChangeOnPartialRange: false,
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
    allowNavigation: types.AllowNavigation.All,
    allowSelection: types.AllowSelection.BetweenStartAndEnd,
    allowRangeSelection: true,
    callOnChangeOnPartialRange: false,
    dragAction: types.DragAction.None,
    endDate: addDays(Date.now(), 35).getTime(),
    numberOfMonths: 2,
    orientation: "column",
    startDate: addDays(Date.now(), 5).getTime(),
    styled: true,
    width: 500
  },
};