import { type DayName } from "./days";

export interface ScheduleDay {
  date: Date;
  dayOfWeek: DayName;
  isPickupDay: boolean;
  isBankHoliday: boolean;
  dosage: number;
  dayNumber: number;
}
