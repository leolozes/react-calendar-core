import { create } from "zustand";
import { addMonths, startOfMonth } from "date-fns";
import { endOfMonth } from "date-fns/esm";

import { AllowPreviousSelection, CalendarMode, DragAction } from "./types";
import  * as call from './stateLogic';

export interface CalendarState {
  allowPreviousNavigation: boolean;
  allowRangeSelection: boolean;
  allowPreviousSelection: AllowPreviousSelection;
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
  startByUser: number;
  clearSelectedDates: () => void;
  onHover: (date: number) => void;
  onMouseDown: (date: number) => void;
  onMouseEnter: (date: number) => void;
  onMouseUp: () => void;
  goToNextMonth: () => void;
  goToNextYear: () => void;
  goToPreviousMonth: () => void;
  goToPreviousYear: () => void;
  setAllowPreviousNavigation: (allow: boolean) => void;
  setAllowPreviousSelection: (allow: AllowPreviousSelection) => void;
  setAllowRangeSelection: (allow: boolean) => void;
  setDisabled: (dates: number[]) => void;
  setDragAction: (action: DragAction) => void;
  setEnd: (date: number) => void;
  setSelectedDates: (dates: number[]) => void;
  setStart: (date: number) => void;
  setStartByUser: (date: number) => void;
}

const today = new Date().getTime();

export const useCalendarStore = create<CalendarState>()(
  (set) => ({
    allowPreviousNavigation: true,
    allowRangeSelection: true,
    allowPreviousSelection: AllowPreviousSelection.All,
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
    startByUser: today,
    clearSelectedDates: () => set((state) => ({ ...state, selectedDates: new Set<number>(), selectedFrom: undefined, selectedTo: undefined })),
    onHover: (date: number) => set((state) => call.onHover(date, state)),
    onMouseDown: (date: number) => set((state) => call.onMouseDown(date, state)),
    onMouseEnter: (date: number) => set((state) => call.onMouseEnter(date, state)),
    onMouseUp: () => set((state) => ({ ...state, dragAction: DragAction.None })),
    goToNextMonth: () => set((state) => call.setStart(addMonths(startOfMonth(state.start), 1).getTime(), state, true)),
    goToNextYear: () => set((state) => call.setStart(addMonths(startOfMonth(state.start), 12).getTime(), state, true)),
    goToPreviousMonth: () => set((state) => call.setStart(addMonths(startOfMonth(state.start), -1).getTime(), state, true)),
    goToPreviousYear: () => set((state) => call.setStart(addMonths(startOfMonth(state.start), -12).getTime(), state, true)),
    setAllowPreviousNavigation: (allow: boolean) => set((state) => ({ ...state, allowPreviousNavigation: allow })),
    setAllowPreviousSelection: (allow: AllowPreviousSelection) => set((state) => ({ ...state, allowPreviousSelection: allow })),
    setAllowRangeSelection: (allow: boolean) => set((state) => ({ ...state, allowRangeSelection: allow })),
    setDisabled: (dates: number[]) => set((state) => call.setDisabled(dates, state)),
    setDragAction: (action: DragAction) => set((state) => ({ ...state, dragAction: action, dragActionByUser: action })),
    setEnd: (date: number) => set((state) => call.setEnd(date, state)),
    setSelectedDates: (dates: number[]) => set((state) => call.setSelectedDates(dates, state)),
    setStart: (date: number) => set((state) => call.setStart(date, state)),
    setStartByUser: (date: number) => set((state) => ({ ...state, startByUser: date })),
  })
)