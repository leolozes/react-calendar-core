import create from "zustand";
import { addDays, addMonths, differenceInMonths, isAfter, isBefore, isSameDay, startOfDay } from "date-fns";
import { endOfMonth, startOfMonth } from "date-fns/esm";

export enum DragAction {
  NONE = "NONE",
  ADD = "ADD",
  CLEAR = "CLEAR",
}

export enum CalendarMode {
  DESKTOP = 'Desktop',
  MOBILE = 'Mobile'
}

interface CalendarState {
  allowPreviousNavigation: boolean,
  disabled: Set<number>;
  dragAction: DragAction;
  end: number;
  hovered: Set<number>;
  mode: CalendarMode;
  numberOfMonths: number;
  selectedDates: Set<number>;
  selectedFrom: number | undefined;
  selectedTo: number | undefined;
  start: number;
  clearSelectedDates: () => void;
  onHover: (date: number) => void;
  onMouseDown: (date: number) => void;
  onMouseEnter: (date: number) => void;
  onMouseUp: () => void;
  setAllowPreviousNavigation: (allow: boolean) => void;
  setDisabled: (dates: number[]) => void;
  setEnd: (date: number) => void;
  setSelectedDates: (dates: number[]) => void;
  setStart: (date: number) => void;
}

const today = new Date().getTime();

export const useCalendarStore = create<CalendarState>()(
  (set) => ({
    allowPreviousNavigation: true,
    disabled: new Set<number>(),
    dragAction: DragAction.NONE,
    end: endOfMonth(today).getTime(),
    hovered: new Set<number>(),
    mode: CalendarMode.DESKTOP,
    numberOfMonths: 1,
    selectedDates: new Set<number>(),
    selectedFrom: undefined,
    selectedTo: undefined,
    start: today,
    clearSelectedDates: () => set((state) => {
      log('clearSelectedDates')
      return { ...state, selectedDates: new Set<number>() };
    }),
    onHover: (date: number) => set((state) => {
      const hoveredDate = startOfDay(date);
      if (state.selectedFrom && !state.selectedTo) {
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
      } else {
        return {
          ...state,
          hovered: new Set([hoveredDate.getTime()])
        };
      }
    }),
    onMouseDown: (date: number) => set((state) => {
      const day = startOfDay(date);
      log('onMouseDown', day)
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
    }),
    onMouseEnter: (date: number) => set((state) => {
      log('onMouseEnter', state.dragAction)
      switch (state.dragAction) {
        case DragAction.ADD:
          return selectDay(state, date);
        case DragAction.CLEAR:
          return clearDay(state, date);
        default:
          break;
      }
      return state;
    }),
    onMouseUp: () => set((state) => {
      log('onMouseUp', state.dragAction)
      return { ...state, dragAction: DragAction.NONE };
    }),
    setAllowPreviousNavigation: (allow: boolean) => set((state) => {
      return { ...state, allowPreviousNavigation: allow };
    }),
    setDisabled: (dates: number[]) => set((state) => {
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
    }),
    setEnd: (date: number) => set((state) => {
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
    }),
    setSelectedDates: (dates: number[]) => set((state) => {
      log('setDates', dates);
      const newDates = new Set<number>(getSelectedDatesInRange(state.start, state.end, dates));
      if (
        newDates.size != state.selectedDates.size ||
        !Array.from(newDates)
          .map((d) => state.selectedDates.has(d))
          .reduce((p, c) => p && c, true)
      ) {
        return {
          ...state,
          selectedDates: newDates,
          hovered: new Set<number>(),
          selectedFrom: dates ? dates[0] : undefined,
          selectedTo: dates ? dates[dates.length - 1] : undefined
        };
      }
      return state;
    }),
    setStart: (date: number) => set((state) => {
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
    }),
  })
)

function clearDay(state: CalendarState, date: number): CalendarState {
  if (state.selectedDates.has(date)) {
    const dates = new Set<number>(Array.from(state.selectedDates).filter((d) => d != date));
    return { ...state, selectedDates: dates };
  }
  return state;
}

function getDaysBetween(startDate: number, endDate: number) {
  const days = new Set<number>();
  for (let date = new Date(startDate); !isAfter(date, endDate); date = addDays(date, 1)) {
    const dateNumber = date.getTime();
    days.add(dateNumber);
  }
  return days;
}

function filterDays(state: CalendarState, numberOfMonths: number, startDate: number, endDate?: number): CalendarState {
  let dates = state.selectedDates;
  const newStartDate = new Date(startDate);
  const newEndDate = endDate ? new Date(endDate) : addDays(addMonths(startDate, numberOfMonths), -1);
  const newNumberOfMonths = differenceInMonths(startOfMonth(newEndDate), startOfMonth(newStartDate)) + 1;
  dates = new Set<number>(Array.from(state.selectedDates).filter((date) => isBefore(date, newStartDate) || isAfter(date, newEndDate)));

  console.log('filterDays', newStartDate, newEndDate, dates, state.selectedDates)
  return {
    ...state,
    selectedDates: dates,
    end: newEndDate.getTime(),
    numberOfMonths: newNumberOfMonths,
    start: newStartDate.getTime(),
  };
}

function selectDay(state: CalendarState, date: number): CalendarState {
  if (!state.selectedDates.has(date)) {
    const dates = new Set<number>(state.selectedDates);
    dates.add(date);
    log('selectDay', dates)
    return { ...state, selectedDates: dates };
  }
  return state;
}

const getSelectedDatesInRange = (startDate: number, endDate: number, selectedDates: number[]) => {
  const datesInRange = [];
  for (const selectedDate of selectedDates) {
    if (selectedDate >= startDate && selectedDate <= endDate) {
      datesInRange.push(selectedDate);
    }
  }
  return datesInRange;
}

const log = (key: string, text?: any) => {
  //console.log(key, text)
}

export const dayHovered = (state: CalendarState, date: number): boolean => state.hovered.has(date) || false;
export const dayInvalid = (state: CalendarState, date: number): boolean => state.disabled.has(date) || false;
export const daySelected = (state: CalendarState, date: number): boolean => state.selectedDates.has(date) || false;
export const isFirstSelectedDay = (state: CalendarState, date: number): boolean => state.selectedFrom === date || false;
export const isLastSelectedDay = (state: CalendarState, date: number): boolean => state.selectedTo === date || false;
