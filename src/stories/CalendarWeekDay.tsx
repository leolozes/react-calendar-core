import React from 'react';
import { types } from '../calendar'

export interface Props extends types.CustomWeekDayProps {
  locale: string;
}

export default function CalendarWeekDay(props: Props) {
  return (
    <div className={`flex items-center justify-center h-10 text-slate-400`}>
      {new Date(props.date).toLocaleString(props.locale, { weekday: 'narrow' })}
    </div>
  )
}