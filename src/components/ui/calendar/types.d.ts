import type * as React from "react";
import type { DayPicker } from "react-day-picker";

export type CalendarProps = React.ComponentPropsWithoutRef<typeof DayPicker> & {
  className?: string;
};
