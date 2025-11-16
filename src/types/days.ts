import { DAYS } from '../utils/days';

export type DayName = (typeof DAYS)[number];
export type AvailableDays = Record<DayName, boolean>;
