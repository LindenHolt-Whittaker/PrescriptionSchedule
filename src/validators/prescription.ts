import { type AvailableDays } from "../types/days";

export const VALIDATION_RULES = {
  dosage: {
    min: 0,
    max: 60,
  },
  changeAmount: {
    min: 1,
    max: 30,
  },
  changeFrequency: {
    min: 1,
    max: 14,
  },
  availableDays: {
    min: 2,
    max: 7,
  },
} as const;

export const isValidDosage = (value: number): boolean => {
  return (
    value >= VALIDATION_RULES.dosage.min && value <= VALIDATION_RULES.dosage.max
  );
};

export const isValidChangeAmount = (value: number): boolean => {
  return (
    value >= VALIDATION_RULES.changeAmount.min &&
    value <= VALIDATION_RULES.changeAmount.max
  );
};

export const isValidChangeFrequency = (value: number): boolean => {
  return (
    value >= VALIDATION_RULES.changeFrequency.min &&
    value <= VALIDATION_RULES.changeFrequency.max
  );
};

export const isValidAvailableDays = (availableDays: AvailableDays): boolean => {
  const count = Object.values(availableDays).filter(Boolean).length;
  return (
    count >= VALIDATION_RULES.availableDays.min &&
    count <= VALIDATION_RULES.availableDays.max
  );
};

export const isValidPrescriptionType = (
  type: string
): type is "stabilisation" | "reducing" | "increasing" => {
  return (
    type === "stabilisation" || type === "reducing" || type === "increasing"
  );
};

export const isValidCountry = (
  type: string
): type is "england" | "northern ireland" | "scotland" | "wales" => {
  return (
    type === "england" ||
    type === "northern ireland" ||
    type === "scotland" ||
    type === "wales"
  );
};

// Validate that dosage has some amount above 0
export const isValidDosageTotal = (
  prescriptionType: string,
  dosage: number
): boolean => {
  return prescriptionType === "increasing" ? true : dosage > 0;
};
