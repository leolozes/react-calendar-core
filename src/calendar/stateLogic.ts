import { addDays, addMonths, differenceInMonths, isAfter, isBefore, isSameDay, startOfDay } from "date-fns";
import { startOfMonth } from "date-fns/esm";

import { DragAction } from "./types";

import { CalendarState } from './state';

/**
 * Controls the hovered day or range if allowRangeSelection is allowed.
 *
 * @param date hovered date.
 * @param state calendar state.
 * @returns updated state.
 */
export const onHover = (date: number, state: CalendarState): CalendarState => {
  const hoveredDate = startOfDay(date);

  if (state.allowRangeSelection && state.selectedFrom && !state.selectedTo) {
    const selectionFrom = startOfDay(state.selectedFrom);
    if (isBefore(hoveredDate, selectionFrom)) {
      return {
        ...state,
        hovered: getDaysBetween(hoveredDate.getTime(), selectionFrom.getTime())
      };
    }
    return {
      ...state,
      hovered: getDaysBetween(selectionFrom.getTime(), hoveredDate.getTime())
    };
  }

  return {
    ...state,
    hovered: new Set([hoveredDate.getTime()])
  };
}

/**
 * Controls the click action on a date.
 *
 * @param date clicked date.
 * @param state calendar state.
 * @returns updated state.
 */
export const onMouseDown = (date: number, state: CalendarState): CalendarState => {
  const day = startOfDay(date);
  log('onMouseDown', day)
  if (state.dragActionByUser !== DragAction.None) {
    if (state.selectedDates.has(day.getTime())) {
      return clearDay({ ...state, dragAction: DragAction.Clear }, day.getTime());
    }
    return selectDay({ ...state, dragAction: DragAction.Add }, day.getTime());
  }

  /* if the range selection is not allowed, we can only select one date */
  if (!state.allowRangeSelection) {
    return {
      ...state,
      selectedFrom: undefined,
      selectedTo: undefined,
      selectedDates: new Set([day.getTime()])
    };
  }

  if (state.selectedFrom) {
    const selectionFrom = startOfDay(state.selectedFrom);
    if (state.selectedTo) {
      const selectionTo = new Date(day);
      return {
        ...state,
        selectedFrom: day.getTime(),
        selectedTo: undefined,
        selectedDates: getDaysBetween(day.getTime(), selectionTo.getTime())
      };
    } else {
      if (isBefore(day, selectionFrom)) {
        return {
          ...state,
          selectedFrom: day.getTime(),
          selectedTo: selectionFrom.getTime(),
          selectedDates: getDaysBetween(day.getTime(), selectionFrom.getTime())
        };
      } else {
        return {
          ...state,
          selectedTo: day.getTime(),
          selectedDates: getDaysBetween(selectionFrom.getTime(), day.getTime())
        };
      }
    }
  } else {
    const selectionTo = new Date(day);
    return {
      ...state,
      selectedFrom: day.getTime(),
      selectedTo: undefined,
      selectedDates: getDaysBetween(day.getTime(), selectionTo.getTime())
    };
  }
}

/**
 * Controls when the mouse is entering a date.
 *
 * Remember:
 * - MouseEnter is when your mouse just goes into the area.
 * - MouseHover is when your mouse stays there for a bit (typically used for tooltips).
 *
 * @param date entered date.
 * @param state calendar state.
 * @returns updated state.
 */
export const onMouseEnter = (date: number, state: CalendarState): CalendarState => {
  log('onMouseEnter', new Date(date), state.dragAction)
  switch (state.dragAction) {
    case DragAction.Add:
      return selectDay(state, date);
    case DragAction.Clear:
      return clearDay(state, date);
    default:
      break;
  }
  return state;
}

export const setDisabled = (dates: number[], state: CalendarState): CalendarState => {
  log('setDisabled', dates);
  const newDates = new Set<number>(dates);
  if (
    newDates.size != state.selectedDates.size ||
    !Array.from(newDates)
      .map((d) => state.selectedDates.has(d))
      .reduce((p, c) => p && c, true)
  ) {
    return { ...state, disabled: newDates };
  }
  return state;
}

export const setEnd = (date: number, state: CalendarState): CalendarState => {
  log('setEnd', date);
  let endDate = startOfDay(date);
  if (!state.allowPreviousNavigation) {
    const today = startOfDay(new Date());
    if (isBefore(endDate, today)) {
      endDate = today;
    }
  }
  if (!state.end || !isSameDay(endDate, state.end)) {
    return filterDays(state, state.numberOfMonths, state.start, endDate.getTime());
  }
  return state;
}

export const setSelectedDates = (dates: number[], state: CalendarState): CalendarState => {
  log('setDates', dates, new Date(state.start));
  const newDates = getSelectedDatesInRange(state.start, state.end, dates);
  if (
    newDates.length != state.selectedDates.size ||
    !newDates
      .map((d) => state.selectedDates.has(d))
      .reduce((p, c) => p && c, true)
  ) {
    return {
      ...state,
      selectedDates: new Set<number>(newDates),
      hovered: new Set<number>(),
      selectedFrom: newDates && state.allowRangeSelection ? newDates[0] : undefined,
      selectedTo: newDates && state.allowRangeSelection ? newDates[newDates.length - 1] : undefined
    };
  }
  return state;
}

export const setStart = (date: number, state: CalendarState): CalendarState => {
  log('setStart', date);
  let startDate = startOfDay(date);

  if (!state.allowPreviousNavigation) {
    const today = startOfDay(new Date());
    if (isBefore(startDate, today)) {
      startDate = today;
    }
  }

  if (!state.start || !isSameDay(startDate, state.start)) {
    return filterDays(state, state.numberOfMonths, startDate.getTime(), state.end);
  }
  return state;
}

function clearDay(state: CalendarState, date: number): CalendarState {
  if (state.selectedDates.has(date)) {
    const dates = new Set<number>(Array.from(state.selectedDates).filter((d) => d != date));
    return { ...state, selectedDates: dates };
  }
  return state;
}


function filterDays(state: CalendarState, numberOfMonths: number, startDate: number, endDate?: number): CalendarState {
  let dates = state.selectedDates;
  const newStartDate = new Date(startDate);
  const newEndDate = endDate ? new Date(endDate) : addDays(addMonths(startDate, numberOfMonths), -1);
  const newNumberOfMonths = differenceInMonths(startOfMonth(newEndDate), startOfMonth(newStartDate)) + 1;
  dates = new Set<number>(Array.from(state.selectedDates).filter((date) => isBefore(date, newStartDate) || isAfter(date, newEndDate)));

  let disabledDates;
  if (!state.allowPreviousSelection) {
    const today = addDays(Date.now(), -1).getTime();
    disabledDates = new Set<number>([...state.disabledByUser, ...getDaysBetween(startOfMonth(startDate).getTime(), today)]);
  } else {
    disabledDates = state.disabledByUser;
  }

  log('filterDays', newStartDate, newEndDate, dates, state.selectedDates);
  return {
    ...state,
    disabled: disabledDates,
    selectedDates: dates,
    end: newEndDate.getTime(),
    numberOfMonths: newNumberOfMonths,
    start: newStartDate.getTime(),
  };
}

function getDaysBetween(startDate: number, endDate: number): Set<number> {
  const days = new Set<number>();
  for (let date = new Date(startDate); !isAfter(date, endDate); date = addDays(date, 1)) {
    const dateNumber = date.getTime();
    days.add(dateNumber);
  }
  return days;
}

const getSelectedDatesInRange = (startDate: number, endDate: number, selectedDates: number[]): number[] => {
  const datesInRange = [];
  for (const selectedDate of selectedDates) {
    if (selectedDate >= startDate && selectedDate <= endDate) {
      datesInRange.push(selectedDate);
    }
  }
  return datesInRange;
}

function selectDay(state: CalendarState, date: number): CalendarState {
  if (!state.selectedDates.has(date)) {
    const dates = new Set<number>(state.selectedDates);
    dates.add(date);
    log('selectDay', dates)
    return { ...state, selectedDates: dates, selectedFrom: undefined, selectedTo: undefined};
  }
  return state;
}

export const dayHovered = (state: CalendarState, date: number): boolean => state.hovered.has(date) || false;
export const dayInvalid = (state: CalendarState, date: number): boolean => state.disabled.has(date) || false;
export const daySelected = (state: CalendarState, date: number): boolean => state.selectedDates.has(date) || false;
export const isFirstSelectedDay = (state: CalendarState, date: number): boolean => state.selectedFrom === date || false;
export const isLastSelectedDay = (state: CalendarState, date: number): boolean => state.selectedTo === date || false;

const log = (key: string, ...text: any[]) => {
  //console.log(key, text)
}

