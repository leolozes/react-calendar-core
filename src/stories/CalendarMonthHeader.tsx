import React, { Dispatch, SetStateAction } from "react";
import { addMonths, startOfMonth } from 'date-fns'
import { ChevronDoubleLeftIcon } from '@heroicons/react/24/solid';
import { ChevronDoubleRightIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { types } from '../calendar'

export interface Props extends types.CustomMonthHeaderProps {
  allowPreviousNavigation: boolean;
  locale: string;
}

export default function (props: Props) {
  const date = new Date();
  date.setDate(1);
  date.setMonth(props.month);
  const className = "h-4 w-4 text-blue-300";
  const disabledClassName = "h-4 w-4 text-slate-600";

  const today = new Date();
  const disabled = (!props.allowPreviousNavigation && props.month === today.getMonth() && props.year === today.getFullYear())

  return (
    <div className="flex items-center justify-between h-10 mb-2 capitalize">
      <div>
        {
          props.isFirst &&
          <>
            <button disabled={disabled} className="p-2" onClick={() => props.previousYear()}>
              <ChevronDoubleLeftIcon className={disabled ? disabledClassName : className} />
            </button>
            <button disabled={disabled} className="p-2" onClick={() => props.previousMonth()}>
              <ChevronLeftIcon className={disabled ? disabledClassName : className} />
            </button>
          </>
        }
      </div>
      <span className="text-slate-400">
        {`${date.toLocaleString(props.locale, { month: 'long' })} ${props.year}`}
      </span>
      <div>
        {
          props.isLast &&
          <>
            <button className="p-2" onClick={() => props.nextMonth()}>
              <ChevronRightIcon className={className} />
            </button>
            <button className="p-2" onClick={() => props.nextYear()}>
              <ChevronDoubleRightIcon className={className} />
            </button>
          </>
        }
      </div>
    </div>
  )
}