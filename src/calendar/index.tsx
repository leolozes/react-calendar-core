import React from "react";

import { addDays, addMonths, startOfDay, startOfMonth } from "date-fns";

import * as types from './types';

import Months from "./Months";

import { useCalendarStore } from "./state";

function Calendar(props: types.CalendarProps) {
  const state = useCalendarStore();

  React.useEffect(() => {
    const startOf = startOfMonth(props.startDate);
    const endDate = addDays(addMonths(startOf, props.numberOfMonths).getTime(), -1).getTime();
    state.setAllowPreviousSelection(props.allowPreviousSelection ?? types.AllowPreviousSelection.All);
    state.setStart(props.allowPreviousSelection ? startOf.getTime() : props.startDate);
    state.setStartByUser(startOfDay(props.startDate).getTime());
    state.setEnd(endDate);
  }, [props.allowPreviousSelection, props.numberOfMonths, props.startDate]);

  React.useEffect(() => {
    state.setAllowPreviousNavigation(props.allowPreviousNavigation ?? true);
  }, [props.allowPreviousNavigation]);

  React.useEffect(() => {
    state.setAllowRangeSelection(props.allowRangeSelection ?? true);
  }, [props.allowRangeSelection]);

  React.useEffect(() => {
    state.setDragAction(props.dragAction ?? types.DragAction.None);
  }, [props.dragAction]);

  React.useEffect(() => {
    if (props.onChange) {
      props.onChange(Array.from(state.selectedDates).sort());
    }
  }, [state.selectedDates]);

  return (
    <>
      <Months {...props} />
    </>
  );
}

export default Calendar;

export { types };
