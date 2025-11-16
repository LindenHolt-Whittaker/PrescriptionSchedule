import { type PrescriptionData } from "../types/prescriptionData";

export const validatePrescriptionData = (data: unknown): PrescriptionData | null => {
  try {
    const parsed = data as Partial<PrescriptionData>;
    
    if (
      !parsed.initialDate ||
      !parsed.availableDays ||
      !parsed.prescriptionType ||
      parsed.dosage === undefined
    ) {
      return null;
    }

    // Validate conditional fields
    const isDynamic = parsed.prescriptionType === "reducing" || parsed.prescriptionType === "increasing";
    if (isDynamic && (!parsed.changeAmount || !parsed.changeFrequency)) {
      return null;
    }

    return {
      ...parsed,
      initialDate: new Date(parsed.initialDate),
    } as PrescriptionData;
  } catch {
    return null;
  }
};
