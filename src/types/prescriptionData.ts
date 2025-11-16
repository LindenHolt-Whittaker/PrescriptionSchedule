import { DAYS } from '../utils/days';

export type DayName = (typeof DAYS)[number];
export type AvailableDays = Record<DayName, boolean>;

export interface PrescriptionData {
  initialDate: Date;
  availableDays: AvailableDays;
  prescriptionType: "stabilisation" | "reducing" | "increasing" | "";
  dosage: number;
  changeAmount?: number;
  changeFrequency?: number;
}
