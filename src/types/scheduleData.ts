import { type DayName } from "./days";

export interface DosageDetail {
  date: Date;
  dosage: number;
}

export interface ScheduleDay {
  date: Date;
  dayOfWeek: DayName;
  isPickupDay: boolean;
  isBankHoliday: boolean;
  dosage: number;
  pickupDosage: number;
  dosageDetails: DosageDetail[];
  dayNumber: number;
}
