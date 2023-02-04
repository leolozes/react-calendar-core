import React from "react";

import { addMonths, startOfMonth } from "date-fns";

import { useCalendarStore } from "./state";

import { Events, Status, WeekStartsOn } from "./constants";

import Month from "./Month";

export interface Props {
  isMobile?: boolean;
  locale: string;
  weekStartsOn: WeekStartsOn;
  renderCalendarContainer?: (month: number, year: number, calendar: JSX.Element) => JSX.Element;
  renderDay?: (day: number, status: Status, events: Events) => JSX.Element;
  renderMonthHeader?: (month: number, year: number) => JSX.Element;
  renderWeekDay?: (weekDay: number) => JSX.Element;
}

function Months(props: Props) {
  const state = useCalendarStore();
  const firstMonth = startOfMonth(state.start);

  return (
    <>
    {
      Array(state.numberOfMonths)
        .fill(1)
        .map((v, i) => {
          const startDate = addMonths(firstMonth, i);
          const month = (
            <Month
              {...props}
              key={`M${i}`}
              startDate={startDate.getTime()}
            />
          );
          return props.renderCalendarContainer
            ? props.renderCalendarContainer(startDate.getMonth(), startDate.getFullYear(), month)
            : month
        })
    }
    </>
  )
}

export default Months;
