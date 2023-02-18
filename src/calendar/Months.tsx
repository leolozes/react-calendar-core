import React from "react";

import { addMonths, startOfMonth } from "date-fns";

import { useCalendarStore } from "./state";

import { MonthsProps } from "./types";

import Month from "./Month";

function Months(props: MonthsProps) {
  const { CalendarContainerComponent } = props;

  const state = useCalendarStore();
  const firstMonth = startOfMonth(state.start);

  console.log('state.numberOfMonths', state.numberOfMonths)
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
          return CalendarContainerComponent
            ? <CalendarContainerComponent
                key={`M${i}`}
                month={startDate.getMonth()}
                year={startDate.getFullYear()}
                children={month}
              />
            : month
        })
    }
    </>
  )
}

export default Months;
