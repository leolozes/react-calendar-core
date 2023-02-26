# react-calendar-core
A customizable multi calendar for your React app.

Made with
- [typescript](https://www.typescriptlang.org)
- [zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [date-fns](https://date-fns.org)

The component has no default styling nor uses any CSS framework to avoid more dependencies and incompabilities with the solution used in your project.

You can style it with any library, passing custom rendering components for each portion of the calendar. The current storybook demo is built with
[tailwindcss](https://tailwindcss.com).

It can be used as a single calendar with single day selection, or multi-month calendar with range selection, or free multi-day selection.

## storybook

The storybook with several diferent demos can be found in the [github page](https://leolozes.github.io/react-calendar-core).

## installation

## usage

#### Props

| Prop name               | Description                                                                                                                                                                                                                                                                                                                                                                                                                | Default value                                         | Example values                                                                                                                                                                                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| allowPreviousNavigation | Indicates if the calendar can be navigated before the indicated `startDate`. | `true` | `false` |
| allowPreviousSelection | Indicates if the user can select dates in the calendar before the indicated `startDate`. | `false` | `true` |
| allowRangeSelection | The type of selection allowed to the user. Range or single date. | `true` | `false` |
| callOnChangeOnPartialRange | Whether to call onChange with only partial result if `allowRangeSelection` is set to `true`. | `true` | `false` |
| disabledDates | Array of dates (in miliseconds) that should be disabled in the calendar. | `undefined` | `[1676242800000]` |
| dragAction | Indicates what to do when the user drags the mouse after a click on the calendar. There's 3 possible values in the `DragAction` type: `Add`, `Clear` and `None`. When the `allowRangeSelection` prop is set to `true`, this value is ignored. Use `All` if you want the user to select dates while dragging the mouse. | `DragAction.None` | `DragAction.Add` |
| endDate | Indicates the end date of the calendar. If a date (in miliseconds) is provided, following calendar dates will be disabled . | `undefined` | `1676242800000` |
| numberOfMonths | Indicates the number of months (calendars) that should be displayed. | _Required prop_ | `2` |
| selectedDates | Array of dates that should be selected by default when rendering the calendar. | `undefined` | `[1676242800000]` |
| startDate | Indicates the start date of the calendar in miliseconds. | _Required prop_ | `1676242800000` |
| onChange | Function called when a date or range (depending on the value of `allowRangeSelection`) is selected by the user. | _Required prop_ | `(dates: number[]) => alert('selectedDays: ', dates)` |

Project configuration was made following the steps of this video: https://www.youtube.com/watch?v=eh89VE3Mk5g