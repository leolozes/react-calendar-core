import { useEffect, useRef } from "react";

import { addDays, differenceInWeeks, endOfMonth, endOfWeek, startOfMonth, startOfWeek, differenceInDays } from "date-fns";

import { MonthProps } from "./types";

import { useCalendarStore } from "./state";
import { isFirstSelectedDay, nextNavigationDisabled, previousNavigationDisabled } from "./stateLogic";

import Day from "./Day";

function Month(props: MonthProps) {
  const { startDate, MonthHeaderComponent, WeekDayComponent } = props;
  const scrollRef = useRef<HTMLTableDataCellElement>(null);
  const state = useCalendarStore();

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(function () {
        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 250);
    }
  }, [startDate, scrollRef.current]);

  const startMonth = startOfMonth(startDate);
  const startWeek = startOfWeek(startMonth,  {weekStartsOn: props.weekStartsOn});
  const startWeekDay = differenceInDays(startMonth, startWeek);
  const endMonth = endOfMonth(startDate);
  const endDate = endMonth.getTime();
  const endWeek = endOfWeek(endMonth);

  let numberOfWeeks = differenceInWeeks(endWeek, startWeek) + 1;
  if (numberOfWeeks < 3) {
    numberOfWeeks = Math.abs((endWeek.getTime() % 52) - (startWeek.getTime() % 52)) + 1;
  }
  const WEEK_DAYS: JSX.Element[] = (() => {
    const date = startOfWeek(startDate,  {weekStartsOn: props.weekStartsOn});
    return Array(7)
      .fill(1)
      .map((_v, i) =>
        (WeekDayComponent)
          ? <WeekDayComponent date={addDays(date, i).getTime()} />
          : <>{addDays(date, i).toLocaleDateString(props.locale, { weekday: 'short' })}</>
      );
  })();

  function getDay(week: number, day: number): JSX.Element {
    const date = addDays(startDate, (7 * week + day) -startWeekDay);
    const dayDate = date.getTime();
    const empty = dayDate < startDate || dayDate > endDate;
    const isSelected = isFirstSelectedDay(state, dayDate);
    return (
      <td key={`D${day + 1}`} ref={isSelected ? scrollRef : undefined} >
        {!empty && <Day {...props} date={dayDate} />}
      </td>
    );
  }

  return (
    <>
      {
        MonthHeaderComponent
        ? <MonthHeaderComponent
            month={startMonth.getMonth()}
            year={startMonth.getFullYear()}
            isFirst={new Date(state.start).getMonth() === startMonth.getMonth()}
            isLast={new Date(state.end).getMonth() === startMonth.getMonth()}
            disabledNavigation={{
              previous: previousNavigationDisabled(state, startMonth.getTime()),
              next: nextNavigationDisabled(state, endMonth.getTime()),
            }}
            nextMonth={() => state.goToNextMonth()}
            nextYear={() => state.goToNextYear()}
            previousMonth={() => state.goToPreviousMonth()}
            previousYear={() => state.goToPreviousYear()}
          />
        : <div>
            {`${startMonth.toLocaleString(props.locale, { month: 'long' })} ${startMonth.getFullYear()}`}
          </div>
      }
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            {WEEK_DAYS.map((day, idx) => <td key={`D${idx}`}>{day}</td>)}
          </tr>
        </thead>
        <tbody>
          {Array(numberOfWeeks)
            .fill(1)
            .map((week, weekIdx) =>
              <tr key={`W${weekIdx + 1}`}>
                {Array(7).fill(1).map((day, dayIdx) => {
                  return getDay(weekIdx, dayIdx)
                })}
              </tr>
            )}
        </tbody>
      </table>
    </>
  );
}

export default Month;
