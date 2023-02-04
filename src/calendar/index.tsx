import React from "react";

import { addDays, addMonths, startOfMonth } from "date-fns";

import * as types from './types';

import Months from "./Months";

import { useCalendarStore } from "./state";

function Calendar(props: types.CalendarProps) {
  const state = useCalendarStore();

  React.useEffect(() => {
    const endDate = addDays(addMonths(new Date(startOfMonth(props.startDate)), props.numberOfMonths).getTime(), -1).getTime();
    state.setStart(props.startDate);
    state.setEnd(endDate);
    state.setAllowPreviousNavigation(props.allowPreviousNavigation ?? true);
    if (props.selectedDates) {
      state.setSelectedDates(props.selectedDates);
    } else {
      state.clearSelectedDates();
    }
  }, [props.allowPreviousNavigation, props.numberOfMonths, props.selectedDates, props.startDate,]);

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
