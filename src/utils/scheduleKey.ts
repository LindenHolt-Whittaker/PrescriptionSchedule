import { type PrescriptionData } from "../types/prescriptionData";
import { type AvailableDays } from "../types/days";
import {
  VALIDATION_RULES,
  isValidPrescriptionType,
} from "../validators/prescription";

/*
  DISCLAIMER: AI generated file
  AI used to create bespoke encoding/decoding,
  provides 7 digit schedule keys for ease of use and cleaner URLs

  Initially generated using Claude Sonnet 4.5
  Human tested, reviewed and improved to ensure working functionality and validation
*/

// Base62 alphabet (URL-safe + compact)
const BASE62_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// Date encoding: days since epoch (16 bits = ~179 years: 2000-2179)
const EPOCH = new Date("2000-01-01").getTime();
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MAX_DAY_INDEX = 0xffff; // 65535 days

// Prescription type enum → bits
const TYPE_MAP: Record<PrescriptionData["prescriptionType"], number> = {
  "": 0,
  stabilisation: 1,
  reducing: 2,
  increasing: 3,
};

const TYPE_MAP_INVERSE: PrescriptionData["prescriptionType"][] = [
  "",
  "stabilisation",
  "reducing",
  "increasing",
];

// ------------------------------------------------------------
// Base62 Encoding / Decoding
// ------------------------------------------------------------
function encodeBase62(num: bigint): string {
  if (num === 0n) return "0";

  let result = "";
  const base = BigInt(BASE62_ALPHABET.length);

  while (num > 0n) {
    const remainder = num % base;
    num = num / base;
    result = BASE62_ALPHABET[Number(remainder)] + result;
  }

  return result;
}

function decodeBase62(str: string): bigint {
  let n = 0n;
  const base = BigInt(BASE62_ALPHABET.length);

  for (let i = 0; i < str.length; i++) {
    const value = BigInt(BASE62_ALPHABET.indexOf(str[i]));
    if (value < 0n) throw new Error("Invalid Base62 character");
    n = n * base + value;
  }

  return n;
}

// ------------------------------------------------------------
// Weekday Encoding / Decoding
// ------------------------------------------------------------
function encodeWeekdays(days: AvailableDays): number {
  // Order: sunday=bit0, monday=bit1, ..., saturday=bit6
  const order: (keyof AvailableDays)[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  let mask = 0;
  order.forEach((day, index) => {
    if (days[day]) mask |= 1 << index;
  });

  return mask; // 0-127
}

function decodeWeekdays(mask: number): AvailableDays {
  return {
    monday: !!(mask & (1 << 0)),
    tuesday: !!(mask & (1 << 1)),
    wednesday: !!(mask & (1 << 2)),
    thursday: !!(mask & (1 << 3)),
    friday: !!(mask & (1 << 4)),
    saturday: !!(mask & (1 << 5)),
    sunday: !!(mask & (1 << 6)),
  };
}

// ------------------------------------------------------------
// Validation before encoding
// ------------------------------------------------------------
function validateForEncoding(data: PrescriptionData): void {
  // Validate prescription type
  if (!isValidPrescriptionType(data.prescriptionType)) {
    throw new Error(`Invalid prescription type: ${data.prescriptionType}`);
  }

  // Validate dosage (6 bits = 0-63, but we limit to validation rules)
  if (
    data.dosage < VALIDATION_RULES.dosage.min ||
    data.dosage > VALIDATION_RULES.dosage.max
  ) {
    throw new Error(
      `Dosage ${data.dosage} out of range (${VALIDATION_RULES.dosage.min}-${VALIDATION_RULES.dosage.max})`
    );
  }

  // Validate date range (16 bits)
  const dayIndex = Math.floor(
    (data.initialDate.getTime() - EPOCH) / MS_PER_DAY
  );
  if (dayIndex < 0 || dayIndex > MAX_DAY_INDEX) {
    throw new Error(`Date out of supported range (2000-2179)`);
  }

  // Validate conditional fields
  const isDynamic =
    data.prescriptionType === "reducing" ||
    data.prescriptionType === "increasing";

  if (isDynamic) {
    if (data.changeAmount === undefined || data.changeFrequency === undefined) {
      throw new Error(
        "Change amount and frequency required for dynamic prescriptions"
      );
    }

    if (
      data.changeAmount < VALIDATION_RULES.changeAmount.min ||
      data.changeAmount > VALIDATION_RULES.changeAmount.max
    ) {
      throw new Error(
        `Change amount ${data.changeAmount} out of range (${VALIDATION_RULES.changeAmount.min}-${VALIDATION_RULES.changeAmount.max})`
      );
    }

    if (
      data.changeFrequency < VALIDATION_RULES.changeFrequency.min ||
      data.changeFrequency > VALIDATION_RULES.changeFrequency.max
    ) {
      throw new Error(
        `Change frequency ${data.changeFrequency} out of range (${VALIDATION_RULES.changeFrequency.min}-${VALIDATION_RULES.changeFrequency.max})`
      );
    }
  }
}

// ------------------------------------------------------------
// Main Encode
// ------------------------------------------------------------
// Bit Layout (total: 41 bits, MSB → LSB):
// [ date:16 ][ days:7 ][ type:2 ][ dosage:6 ][ changeAmt:6 ][ changeFreq:4 ]
// ------------------------------------------------------------
export function encodePrescriptionData(data: PrescriptionData): string {
  // Validate inputs before encoding
  validateForEncoding(data);

  // Date → 16-bit day index
  const dayIndex = Math.floor(
    (data.initialDate.getTime() - EPOCH) / MS_PER_DAY
  );

  const weekdayMask = encodeWeekdays(data.availableDays);
  const typeBits = TYPE_MAP[data.prescriptionType];
  const dosage = data.dosage;
  const changeAmt = data.changeAmount ?? 0;
  const changeFreq = data.changeFrequency ?? 0;

  // Pack into bigint (41 bits)
  const n =
    (BigInt(dayIndex) << 25n) | // bits 25-40 (16 bits)
    (BigInt(weekdayMask) << 18n) | // bits 18-24 (7 bits)
    (BigInt(typeBits) << 16n) | // bits 16-17 (2 bits)
    (BigInt(dosage) << 10n) | // bits 10-15 (6 bits)
    (BigInt(changeAmt) << 4n) | // bits 4-9 (6 bits)
    BigInt(changeFreq); // bits 0-3 (4 bits)

  return encodeBase62(n);
}

// ------------------------------------------------------------
// Main Decode
// ------------------------------------------------------------
export function decodePrescriptionKey(key: string): PrescriptionData | null {
  try {
    const n = decodeBase62(key);

    // Extract bit fields
    const dayIndex = Number((n >> 25n) & 0xffffn); // 16 bits
    const weekdayMask = Number((n >> 18n) & 0x7fn); // 7 bits
    const typeBits = Number((n >> 16n) & 0x3n); // 2 bits
    const dosage = Number((n >> 10n) & 0x3fn); // 6 bits
    const changeAmt = Number((n >> 4n) & 0x3fn); // 6 bits
    const changeFreq = Number(n & 0xfn); // 4 bits

    // Reconstruct date
    const initialDate = new Date(EPOCH + dayIndex * MS_PER_DAY);

    // Reconstruct prescription type
    const prescriptionType = TYPE_MAP_INVERSE[typeBits];

    // Reconstruct available days
    const availableDays = decodeWeekdays(weekdayMask);

    return {
      initialDate,
      availableDays,
      prescriptionType,
      dosage,
      changeAmount: changeAmt || undefined,
      changeFrequency: changeFreq || undefined,
    };
  } catch (error) {
    console.error("Failed to decode prescription key:", error);
    return null;
  }
}
