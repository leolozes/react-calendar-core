import React from 'react';
import { types } from '../calendar'

const getStatusClass = (status: types.DayStatus) => {
  if (status.disabled) return "text-slate-500";
  if (status.firstSelected || status.lastSelected) return "bg-violet-700";
  if (status.selected) return "bg-violet-500";
  if (status.hovered) return "bg-violet-900";
  return "";
}

export default function CalendarDay(props: types.CustomDayProps) {
  return (
    <div
      {...props.events}
      className={`flex items-center justify-center h-10 ${getStatusClass(props.status)} ${props.status.disabled ? "" : "cursor-pointer"}`}>
      {new Date(props.date).getDate()}
    </div>
  )
}