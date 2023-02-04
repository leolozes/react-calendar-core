import { useEffect, useState } from 'react'
import { addMonths, startOfDay } from 'date-fns'
import { ChevronDoubleLeftIcon } from '@heroicons/react/24/solid';
import { ChevronDoubleRightIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Calendar, { Events, Status, WeekStartsOn } from '../calendar'

function getLocale() {
  if (navigator.languages != undefined)
    return navigator.languages[0];
  return navigator.language;
}

export interface Props {
  numberOfMonths?: number;
  orientation?: "row" | "column";
  styled: boolean;
  width?: number | string;
}

export default function Demo (props: Props) {
  const [months, setMonths] = useState(0);
  const [startDate, setStartDate] = useState(Date.now());
  const locale = getLocale();

  useEffect(() => {
    setMonths(props.numberOfMonths ?? 1);
  }, [props.numberOfMonths]);

  const getStatusClass = (status: Status) => {
    if (status.disabled) return "disabled";
    if (status.firstSelected || status.lastSelected) return "bg-violet-700";
    if (status.selected) return "bg-violet-500";
    if (status.hovered) return "bg-violet-900";
    return "";
  }

  const renderCalendarContainer = (month: number, year: number, children: JSX.Element) => {
    return (
      <div id={`${month}-${year}`} key={`${month}-${year}`} className="flex flex-col grow bg-slate-800 p-2 m-2 text-slate-300">
        {children}
      </div>
    )
  }

  const renderDay = (day: number, status: Status, events: Events) => {
    return (
      <div
        {...events}
        className={`cursor-pointer flex items-center justify-center h-10 ${getStatusClass(status)}`}>
        {new Date(day).getDate()}
      </div>
    )
  }

  const renderMonthHeader = (month: number, year: number) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(month);
    const className = "h-4 w-4 text-blue-300";
    return (
      <div className="flex items-center justify-between h-10 mb-2 capitalize">
        <div>
          <button className="p-2" onClick={() => setStartDate(addMonths(startDate, -12).getTime())}>
            <ChevronDoubleLeftIcon className={className} />
          </button>
          <button className="p-2" onClick={() => setStartDate(addMonths(startDate, -1).getTime())}>
            <ChevronLeftIcon className={className} />
          </button>
        </div>
        <span className="text-slate-400">
          {`${date.toLocaleString(locale, { month: 'long' })} ${year}`}
        </span>
        <div>
          <button className="p-2" onClick={() => setStartDate(addMonths(startDate, 1).getTime())}>
            <ChevronRightIcon className={className} />
          </button>
          <button className="p-2" onClick={() => setStartDate(addMonths(startDate, 12).getTime())}>
            <ChevronDoubleRightIcon className={className} />
          </button>
        </div>
      </div>
    )
  }

  const renderWeekDay = (date: number) => {
    return (
      <div className={`flex items-center justify-center h-10 text-slate-400`}>
        {new Date(date).toLocaleString(locale, { weekday: 'narrow' })}
      </div>
    );
  }

  return (
    <div style={{ width: props.width ?? 500 }} className={`flex ${props.orientation === "column" ? "flex-col" : "flex-row"}`}>
      <Calendar
        locale={locale}
        startDate={startDate}
        numberOfMonths={months}
        weekStartsOn={WeekStartsOn.Monday}
        selectedDates={[startOfDay(1674987818583).getTime()]}
        renderCalendarContainer={props.styled ? renderCalendarContainer : undefined}
        renderDay={props.styled ? renderDay : undefined}
        renderMonthHeader={props.styled ? renderMonthHeader : undefined}
        renderWeekDay={props.styled ? renderWeekDay : undefined}
      />
    </div>
  )
}