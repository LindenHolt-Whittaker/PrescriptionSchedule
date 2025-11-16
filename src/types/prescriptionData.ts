import { type AvailableDays } from "./days";

export interface PrescriptionData {
  initialDate: Date;
  availableDays: AvailableDays;
  prescriptionType: "stabilisation" | "reducing" | "increasing" | "";
  dosage: number;
  changeAmount?: number;
  changeFrequency?: number;
}
