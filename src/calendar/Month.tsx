import { useEffect, useRef } from "react";

import { addDays, differenceInWeeks, endOfMonth, endOfWeek, startOfMonth, startOfWeek, differenceInDays } from "date-fns";

import { Events, Status, WeekStartsOn } from "./constants";

import { isFirstSelectedDay, useCalendarStore } from "./state";

import Day from "./Day";

export interface Props {
  locale: string;
  startDate: number;
  weekStartsOn: WeekStartsOn;
  renderDay?: (day: number, status: Status, events: Events) => JSX.Element;
  renderMonthHeader?: (month: number, year: number) => JSX.Element;
  renderWeekDay?: (weekDay: number) => JSX.Element;
}

function Month(props: Props) {
  const { renderDay, startDate } = props;
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
        (props.renderWeekDay)
          ? props.renderWeekDay(addDays(date, i).getTime())
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
        {!empty && <Day date={dayDate} renderDay={renderDay} />}
      </td>
    );
  }

  return (
    <>
      {
        props.renderMonthHeader
        ? props.renderMonthHeader(startMonth.getMonth(), startMonth.getFullYear())
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
                {Array(7).fill(1).map((day, dayIdx) => getDay(weekIdx, dayIdx))}
              </tr>
            )}
        </tbody>
      </table>
    </>
  );
}

export default Month;
