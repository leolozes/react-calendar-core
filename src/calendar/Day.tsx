import React from "react";

import { CalendarMode, DayProps, DayStatus, DayEvents, DragAction } from './types';

import { useCalendarStore } from "./state";

import { dayHovered, dayInvalid, daySelected, isFirstSelectedDay, isLastSelectedDay } from "./stateLogic";

function Day(props: DayProps) {
  const { date, DayComponent } = props;

  const state = useCalendarStore()

  const status: DayStatus = {
    disabled: dayInvalid(state, date),
    hovered: dayHovered(state, date),
    selected: daySelected(state, date),
    firstSelected: isFirstSelectedDay(state, date),
    lastSelected: isLastSelectedDay(state, date)
  }

  const handleOnHover = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!status.disabled) {
      state.onHover(date);
    }
  };

  const handleOnMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!status.disabled) {
      state.onMouseDown(date);
    }
  };

  const handleOnMouseEnter = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!status.disabled) {
      if (state.dragAction !== DragAction.None) {
        if (event.buttons) {
          state.onMouseEnter(date);
        } else {
          state.onMouseUp();
        }
      }
    }
  };

  const handleOnMouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    state.onMouseUp();
  };

  const events: DayEvents = {
    onMouseDownCapture: handleOnMouseDown,
    onMouseEnter: handleOnMouseEnter,
    onMouseOver: state.mode === CalendarMode.Desktop ? handleOnHover : undefined,
    onMouseUpCapture: handleOnMouseUp,
  }

  if (DayComponent) {
    return <DayComponent date={date} status={status} events={events} />
  }

  return (
    <div {...events}>
      {new Date(date).getDate()}
    </div>
  );
}

export default Day;
