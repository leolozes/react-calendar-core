import React, { useEffect, useState } from 'react';
import Calendar, { types } from '../calendar';
import CalendarContainer from './CalendarContainer';
import CalendarDay from './CalendarDay';
import CalendarMonthHeader from './CalendarMonthHeader';
import CalendarWeekDay from './CalendarWeekDay';

function getLocale() {
  if (navigator.languages != undefined)
    return navigator.languages[0];
  return navigator.language;
}

export interface Props {
  allowPreviousNavigation: boolean;
  numberOfMonths?: number;
  orientation?: "row" | "column";
  styled: boolean;
  width?: number | string;
}

export default function Demo (props: Props) {
  const [months, setMonths] = useState(0);
  const [startDate, setStartDate] = useState(Date.now());
  const [dates, setDates] = useState<number[]>([]);
  const locale = getLocale();

  useEffect(() => {
    setMonths(props.numberOfMonths ?? 1);
  }, [props.numberOfMonths]);

  const renderWeekDay = (date: number) => {
    return (
      <div className={`flex items-center justify-center h-10 text-slate-400`}>
        {new Date(date).toLocaleString(locale, { weekday: 'narrow' })}
      </div>
    );
  }

  const onChange = (dates: number[]): void => {
    setDates(dates);
  }

  return (
    <div style={{ width: props.width ?? 500 }}>
      <div className={`flex ${props.orientation === "column" ? "flex-col" : "flex-row"}`}>
        <Calendar
          allowPreviousNavigation={props.allowPreviousNavigation}
          locale={locale}
          numberOfMonths={months}
          selectedDates={dates}
          startDate={startDate}
          weekStartsOn={types.WeekStartsOn.Monday}
          onChange={onChange}
          CalendarContainerComponent={
            props.styled
              ? (containerProps: types.CustomCalendarContainerProps) => <CalendarContainer {...containerProps} />
              : undefined
          }
          DayComponent={
            props.styled
              ? (dayProps: types.CustomDayProps) => <CalendarDay {...dayProps} />
              : undefined
          }
          MonthHeaderComponent={
            props.styled
              ? (montHeaderProps: types.CustomMonthHeaderProps) =>
                  <CalendarMonthHeader
                    {...montHeaderProps}
                    allowPreviousNavigation={props.allowPreviousNavigation}
                    locale={locale}
                    startDate={startDate}
                    setStartDate={setStartDate}
                  />
              : undefined
          }
          WeekDayComponent={
            props.styled
              ? (weekDayProps: types.CustomWeekDayProps) => <CalendarWeekDay {...weekDayProps} locale={locale} />
              : undefined
          }
        />
      </div>
      <div className="bg-slate-600 m-2 p-2 text-slate-400">
        Selected dates:
        <div className="break-all">
          {dates.map(date => <React.Fragment key={date}>{new Date(date).toLocaleDateString(locale, { day: 'numeric', month: 'numeric' })},&nbsp;</React.Fragment>)}
        </div>
      </div>
    </div>
  )
}