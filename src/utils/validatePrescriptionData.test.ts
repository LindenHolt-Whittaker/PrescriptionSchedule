import { describe, it, expect } from "vitest";
import { validatePrescriptionData } from "./validatePrescriptionData";
import type { AvailableDays } from "../types/days";

describe("validatePrescriptionData", () => {
  const validAvailableDays: AvailableDays = {
    monday: true,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: true,
  };

  it("should validate complete stabilisation prescription data", () => {
    const data = {
      country: "england",
      initialDate: new Date("2024-03-15"),
      availableDays: validAvailableDays,
      prescriptionType: "stabilisation",
      dosage: 30,
    };

    const result = validatePrescriptionData(data);
    expect(result).not.toBeNull();
    expect(result?.country).toBe("england");
    expect(result?.dosage).toBe(30);
  });

  it("should validate reducing prescription with change fields", () => {
    const data = {
      country: "scotland",
      initialDate: new Date("2024-03-15"),
      availableDays: validAvailableDays,
      prescriptionType: "reducing",
      dosage: 40,
      changeAmount: 5,
      changeFrequency: 7,
    };

    const result = validatePrescriptionData(data);
    expect(result).not.toBeNull();
    expect(result?.prescriptionType).toBe("reducing");
    expect(result?.changeAmount).toBe(5);
    expect(result?.changeFrequency).toBe(7);
  });

  it("should validate increasing prescription with change fields", () => {
    const data = {
      country: "wales",
      initialDate: new Date("2024-03-15"),
      availableDays: validAvailableDays,
      prescriptionType: "increasing",
      dosage: 0,
      changeAmount: 2,
      changeFrequency: 3,
    };

    const result = validatePrescriptionData(data);
    expect(result).not.toBeNull();
    expect(result?.prescriptionType).toBe("increasing");
  });

  it("should return null when required fields are missing", () => {
    expect(validatePrescriptionData({})).toBeNull();
    expect(validatePrescriptionData({ country: "england" })).toBeNull();
    expect(validatePrescriptionData({ dosage: 30 })).toBeNull();
  });

  it("should return null for invalid prescription type", () => {
    const data = {
      country: "england",
      initialDate: new Date("2024-03-15"),
      availableDays: validAvailableDays,
      prescriptionType: "Stabilizing",
      dosage: 30,
    };

    expect(validatePrescriptionData(data)).toBeNull();
  });

  it("should return null for invalid country", () => {
    const data = {
      country: "ireland",
      initialDate: new Date("2024-03-15"),
      availableDays: validAvailableDays,
      prescriptionType: "stabilisation",
      dosage: 30,
    };

    expect(validatePrescriptionData(data)).toBeNull();
  });

  it("should return null for invalid dosage", () => {
    const data = {
      country: "england",
      initialDate: new Date("2024-03-15"),
      availableDays: validAvailableDays,
      prescriptionType: "stabilisation",
      dosage: 100,
    };

    expect(validatePrescriptionData(data)).toBeNull();
  });

  it("should return null when reducing/increasing prescription missing change fields", () => {
    const data = {
      country: "england",
      initialDate: new Date("2024-03-15"),
      availableDays: validAvailableDays,
      prescriptionType: "reducing",
      dosage: 30,
    };

    expect(validatePrescriptionData(data)).toBeNull();
  });

  it("should return null for invalid available days", () => {
    const invalidDays: AvailableDays = {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: true,
    };

    const data = {
      country: "england",
      initialDate: new Date("2024-03-15"),
      availableDays: invalidDays,
      prescriptionType: "stabilisation",
      dosage: 30,
    };

    expect(validatePrescriptionData(data)).toBeNull();
  });

  it("should return null for stabilisation with zero dosage", () => {
    const data = {
      country: "england",
      initialDate: new Date("2024-03-15"),
      availableDays: validAvailableDays,
      prescriptionType: "stabilisation",
      dosage: 0,
    };

    expect(validatePrescriptionData(data)).toBeNull();
  });

  it("should parse string numbers correctly", () => {
    const data = {
      country: "england",
      initialDate: new Date("2024-03-15"),
      availableDays: validAvailableDays,
      prescriptionType: "reducing",
      dosage: "30",
      changeAmount: "5",
      changeFrequency: "7",
    };

    const result = validatePrescriptionData(data);
    expect(result).not.toBeNull();
    expect(result?.dosage).toBe(30);
    expect(result?.changeAmount).toBe(5);
    expect(result?.changeFrequency).toBe(7);
  });
});
