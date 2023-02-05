export enum CalendarMode {
  Desktop = 'Desktop',
  Mobile = 'Mobile'
}

export enum DragAction {
  None = "None",
  Add = "Add",
  Clear = "Clear",
}

export enum AllowPreviousSelection {
  AfterToday = "AfterToday",
  AfterStartDate = "AfterStartDate",
  All = "All"
}

export enum WeekStartsOn {
  Monday = 1,
  Sunday = 0,
  Saturday = 6,
}

export interface CalendarProps extends MonthsProps {
  allowPreviousNavigation?: boolean;
  allowRangeSelection?: boolean;
  allowPreviousSelection?: AllowPreviousSelection;
  disabledDates?: number[] | null | undefined;
  dragAction?: DragAction;
  endDate?: number | undefined;
  numberOfMonths: number;
  selectedDates?: number[] | null | undefined;
  startDate: number;
  onChange?: (dates: number[]) => void;
}

export interface DayProps {
  date: number;
  DayComponent?: React.JSXElementConstructor<CustomDayProps>;
}


export interface MonthProps extends CommonCalendarProps {
  startDate: number;
}

export interface MonthsProps extends CommonCalendarProps {
  CalendarContainerComponent?: React.JSXElementConstructor<CustomCalendarContainerProps>;
}

export interface CommonCalendarProps {
  locale: string;
  weekStartsOn: WeekStartsOn;
  DayComponent?: React.JSXElementConstructor<CustomDayProps>;
  MonthHeaderComponent?: React.JSXElementConstructor<CustomMonthHeaderProps>;
  WeekDayComponent?: React.JSXElementConstructor<CustomWeekDayProps>;
}

export interface DayEvents {
  onMouseDownCapture: React.MouseEventHandler;
  onMouseEnter: React.MouseEventHandler;
  onMouseOver: React.MouseEventHandler | undefined;
  onMouseUpCapture: React.MouseEventHandler;
}

export interface DayStatus {
  disabled: boolean;
  hovered: boolean;
  firstSelected: boolean;
  lastSelected: boolean
  selected: boolean;
}

export interface CustomCalendarContainerProps {
  children: JSX.Element;
  month: number;
  year: number;
}

export interface CustomDayProps {
  date: number;
  status: DayStatus;
  events: DayEvents;
}

export interface CustomMonthHeaderProps {
  month: number;
  year: number;
  isFirst: boolean;
  isLast: boolean;
  nextMonth: () => void;
  nextYear: () => void;
  previousMonth: () => void;
  previousYear: () => void;
}

export interface CustomWeekDayProps {
  date: number;
}