import React from "react";

import { addDays, addMonths, startOfDay, startOfMonth } from "date-fns";

import * as types from './types';

import Months from "./Months";

import { useCalendarStore } from "./state";

function Calendar(props: types.CalendarProps) {
  const state = useCalendarStore();

  React.useEffect(() => {
    state.setStart(props.startDate);
    state.setStartByUser(props.startDate);
  }, [props.numberOfMonths, props.startDate]);

  React.useEffect(() => {
    const startOf = startOfMonth(state.start);
    const endDate = addDays(addMonths(startOf, props.numberOfMonths).getTime(), -1).getTime();
    state.setEnd(endDate);
  }, [props.numberOfMonths]);

  React.useEffect(() => {
    state.setAllowPreviousNavigation(props.allowPreviousNavigation ?? true);
  }, [props.allowPreviousNavigation]);

  React.useEffect(() => {
    const startOf = startOfMonth(state.startByUser);
    state.setAllowPreviousSelection(props.allowPreviousSelection ?? types.AllowPrevious.All);
    state.setStart(props.allowPreviousSelection ? startOf.getTime() : state.startByUser);
  }, [props.allowPreviousSelection]);

  React.useEffect(() => {
    state.setAllowRangeSelection(props.allowRangeSelection ?? true);
  }, [props.allowRangeSelection]);

  React.useEffect(() => {
    state.setCallOnChangeOnPartialRange(props.callOnChangeOnPartialRange ?? true);
  }, [props.callOnChangeOnPartialRange]);

  React.useEffect(() => {
    state.setDragAction(props.dragAction ?? types.DragAction.None);
  }, [props.dragAction]);

  React.useEffect(() => {
    if (props.onChange) {
      if (state.allowRangeSelection && !state.callOnChangeOnPartialRange) {
        if (state.selectedDates.size > 1) {
          props.onChange(Array.from(state.selectedDates).sort());
        }
      } else {
        props.onChange(Array.from(state.selectedDates).sort());
      }
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
