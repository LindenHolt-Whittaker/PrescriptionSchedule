import { type AvailableDays } from "./days";

export interface PrescriptionData {
  country: "england" | "northern ireland" | "scotland" | "wales" | "";
  initialDate: Date;
  availableDays: AvailableDays;
  prescriptionType: "stabilisation" | "reducing" | "increasing" | "";
  dosage: number;
  changeAmount?: number;
  changeFrequency?: number;
}
