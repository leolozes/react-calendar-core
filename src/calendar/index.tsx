import React from "react";

import { addMonths } from "date-fns";

import { Events, Status, WeekStartsOn } from "./constants";

import Months from "./Months";

import { useCalendarStore } from "./state";

export interface Props {
  disabledDates?: number[] | null | undefined;
  endDate?: number | undefined;
  locale: string;
  numberOfMonths: number;
  selectedDates?: number[] | null | undefined;
  startDate: number;
  weekStartsOn: WeekStartsOn;
  onChange?: (dates: number[]) => void;
  renderCalendarContainer?: (month: number, year: number, calendar: JSX.Element) => JSX.Element;
  renderDay?: (day: number, status: Status, events: Events) => JSX.Element;
  renderMonthHeader?: (month: number, year: number) => JSX.Element;
  renderWeekDay?: (weekDay: number) => JSX.Element;
}

function Calendar(props: Props) {
  const state = useCalendarStore();

  React.useEffect(() => {
    state.setStart(props.startDate);
    state.setEnd(addMonths(new Date(props.startDate), props.numberOfMonths - 1).getTime());

    if (props.selectedDates) {
      state.setSelectedDates(props.selectedDates);
    } else {
      state.clearSelectedDates();
    }
  }, [props.startDate, props.numberOfMonths, props.selectedDates]);

  return (
    <>
      <Months {...props} />
    </>
  );
}

export default Calendar;

export { WeekStartsOn }

export type { Events, Status }
