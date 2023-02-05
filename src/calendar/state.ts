import { create } from "zustand";
import { endOfMonth } from "date-fns/esm";

import { CalendarMode, DragAction } from "./types";
import  * as call from './stateLogic';

export interface CalendarState {
  allowPreviousNavigation: boolean;
  allowRangeSelection: boolean;
  allowPreviousSelection: boolean;
  disabled: Set<number>;
  disabledByUser: Set<number>;
  dragAction: DragAction;
  dragActionByUser: DragAction;
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
  setAllowPreviousSelection: (allow: boolean) => void;
  setAllowRangeSelection: (allow: boolean) => void;
  setDisabled: (dates: number[]) => void;
  setDragAction: (action: DragAction) => void;
  setEnd: (date: number) => void;
  setSelectedDates: (dates: number[]) => void;
  setStart: (date: number) => void;
}

const today = new Date().getTime();

export const useCalendarStore = create<CalendarState>()(
  (set) => ({
    allowPreviousNavigation: true,
    allowRangeSelection: true,
    allowPreviousSelection: true,
    disabled: new Set<number>(),
    disabledByUser: new Set<number>(),
    dragAction: DragAction.None,
    dragActionByUser: DragAction.None,
    end: endOfMonth(today).getTime(),
    hovered: new Set<number>(),
    mode: CalendarMode.Desktop,
    numberOfMonths: 1,
    selectedDates: new Set<number>(),
    selectedFrom: undefined,
    selectedTo: undefined,
    start: today,
    clearSelectedDates: () => set((state) => ({ ...state, selectedDates: new Set<number>(), selectedFrom: undefined, selectedTo: undefined })),
    onHover: (date: number) => set((state) => call.onHover(date, state)),
    onMouseDown: (date: number) => set((state) => call.onMouseDown(date, state)),
    onMouseEnter: (date: number) => set((state) => call.onMouseEnter(date, state)),
    onMouseUp: () => set((state) => ({ ...state, dragAction: DragAction.None })),
    setAllowPreviousNavigation: (allow: boolean) => set((state) => ({ ...state, allowPreviousNavigation: allow })),
    setAllowPreviousSelection: (allow: boolean) => set((state) => ({ ...state, allowPreviousSelection: allow })),
    setAllowRangeSelection: (allow: boolean) => set((state) => ({ ...state, allowRangeSelection: allow })),
    setDisabled: (dates: number[]) => set((state) => call.setDisabled(dates, state)),
    setDragAction: (action: DragAction) => set((state) => ({ ...state, dragAction: action, dragActionByUser: action })),
    setEnd: (date: number) => set((state) => call.setEnd(date, state)),
    setSelectedDates: (dates: number[]) => set((state) => call.setSelectedDates(dates, state)),
    setStart: (date: number) => set((state) => call.setStart(date, state)),
  })
)