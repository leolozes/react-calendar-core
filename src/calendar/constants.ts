export enum WeekStartsOn {
  Monday = 1,
  Sunday = 0,
  Saturday = 6,
}

export interface Status {
  disabled: boolean;
  hovered: boolean;
  firstSelected: boolean;
  lastSelected: boolean
  selected: boolean;
}

export interface Events {
  onMouseDownCapture: React.MouseEventHandler;
  onMouseEnter: React.MouseEventHandler;
  onMouseOver: React.MouseEventHandler | undefined;
  onMouseUpCapture: React.MouseEventHandler;
}
