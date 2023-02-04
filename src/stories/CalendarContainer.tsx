import React from 'react';
import { types } from '../calendar'

export default function CalendarContainer(props: types.CustomCalendarContainerProps) {
  return (
    <div
      id={`${props.month}-${props.year}`}
      key={`${props.month}-${props.year}`}
      className="flex flex-col grow bg-slate-800 p-2 m-2 text-slate-300">
      {props.children}
    </div>
  )
}