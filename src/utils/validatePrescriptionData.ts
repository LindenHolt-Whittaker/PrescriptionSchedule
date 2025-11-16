import { type PrescriptionData } from "../types/prescriptionData";
import { 
  isValidDosage, 
  isValidChangeAmount, 
  isValidChangeFrequency,
  isValidAvailableDays,
  isValidPrescriptionType
} from "../validators/prescription";

export const validatePrescriptionData = (
  data: unknown
): PrescriptionData | null => {
  try {
    const parsed = data as Partial<PrescriptionData>;

    // Check required fields exist
    if (
      !parsed.initialDate ||
      !parsed.availableDays ||
      !parsed.prescriptionType ||
      parsed.dosage === undefined
    ) {
      return null;
    }

    if (!isValidPrescriptionType(parsed.prescriptionType)) {
      return null;
    }

    // Parsing numbers before validation
    const dosage = Number(parsed.dosage);
    const changeAmount = parsed.changeAmount ? Number(parsed.changeAmount) : undefined;
    const changeFrequency = parsed.changeFrequency ? Number(parsed.changeFrequency) : undefined;

    if (!isValidDosage(dosage)) {
      return null;
    }

    if (!isValidAvailableDays(parsed.availableDays)) {
      return null;
    }

    // Validate conditional fields for increasing/reducing
    const isDynamic = parsed.prescriptionType === "reducing" || parsed.prescriptionType === "increasing";
    
    if (isDynamic) {
      if (!changeAmount || !changeFrequency) {
        return null;
      }
      
      if (!isValidChangeAmount(changeAmount) || !isValidChangeFrequency(changeFrequency)) {
        return null;
      }
    }

    return {
      ...parsed,
      initialDate: new Date(parsed.initialDate),
      dosage,
      changeAmount,
      changeFrequency,
    } as PrescriptionData;
  } catch {
    return null;
  }
};