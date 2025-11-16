import {type AvailableDays} from "../types/prescriptionData";

export const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const getDefaultDays = (): AvailableDays => {
  return DAYS.reduce(
    (acc, day) => ({ ...acc, [day]: false }),
    {} as AvailableDays
  );
};

export const capitalizeDayName = (day: string): string => {
  return day.charAt(0).toUpperCase() + day.slice(1);
};

export const getSelectedDays = (availableDays: AvailableDays): string[] => {
  return Object.entries(availableDays)
    .filter(([, isSelected]) => isSelected)
    .map(([day]) => capitalizeDayName(day));
};

export const formatSelectedDays = (availableDays: AvailableDays): string => {
  return getSelectedDays(availableDays).join(", ");
};
