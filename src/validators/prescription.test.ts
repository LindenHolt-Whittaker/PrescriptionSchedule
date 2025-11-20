import { describe, it, expect } from "vitest";
import {
  isValidDosage,
  isValidChangeAmount,
  isValidChangeFrequency,
  isValidAvailableDays,
  isValidPrescriptionType,
  isValidCountry,
  isValidDosageTotal,
} from "./prescription";
import type { AvailableDays } from "../types/days";

describe("isValidDosage", () => {
  it("should return true for valid dosages", () => {
    expect(isValidDosage(0)).toBe(true);
    expect(isValidDosage(30)).toBe(true);
    expect(isValidDosage(60)).toBe(true);
  });

  it("should return false for invalid dosages", () => {
    expect(isValidDosage(-1)).toBe(false);
    expect(isValidDosage(61)).toBe(false);
    expect(isValidDosage(100)).toBe(false);
  });
});

describe("isValidChangeAmount", () => {
  it("should return true for valid change amounts", () => {
    expect(isValidChangeAmount(1)).toBe(true);
    expect(isValidChangeAmount(15)).toBe(true);
    expect(isValidChangeAmount(30)).toBe(true);
  });

  it("should return false for invalid change amounts", () => {
    expect(isValidChangeAmount(0)).toBe(false);
    expect(isValidChangeAmount(31)).toBe(false);
    expect(isValidChangeAmount(-5)).toBe(false);
  });
});

describe("isValidChangeFrequency", () => {
  it("should return true for valid change frequencies", () => {
    expect(isValidChangeFrequency(1)).toBe(true);
    expect(isValidChangeFrequency(7)).toBe(true);
    expect(isValidChangeFrequency(14)).toBe(true);
  });

  it("should return false for invalid change frequencies", () => {
    expect(isValidChangeFrequency(0)).toBe(false);
    expect(isValidChangeFrequency(15)).toBe(false);
    expect(isValidChangeFrequency(-1)).toBe(false);
  });
});

describe("isValidAvailableDays", () => {
  it("should return true for valid day selections", () => {
    const twoDays: AvailableDays = {
      monday: true,
      tuesday: true,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    };
    expect(isValidAvailableDays(twoDays)).toBe(true);

    const sevenDays: AvailableDays = {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    };
    expect(isValidAvailableDays(sevenDays)).toBe(true);
  });

  it("should return false for invalid day selections", () => {
    const oneDay: AvailableDays = {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: true,
      saturday: false,
      sunday: false,
    };
    expect(isValidAvailableDays(oneDay)).toBe(false);

    const noDays: AvailableDays = {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    };
    expect(isValidAvailableDays(noDays)).toBe(false);
  });
});

describe("isValidPrescriptionType", () => {
  it("should return true for valid prescription types", () => {
    expect(isValidPrescriptionType("stabilisation")).toBe(true);
    expect(isValidPrescriptionType("reducing")).toBe(true);
    expect(isValidPrescriptionType("increasing")).toBe(true);
  });

  it("should return false for invalid prescription types", () => {
    expect(isValidPrescriptionType("")).toBe(false);
    expect(isValidPrescriptionType("foobar")).toBe(false);
    expect(isValidPrescriptionType("Stabilisation")).toBe(false);
  });
});

describe("isValidCountry", () => {
  it("should return true for valid countries", () => {
    expect(isValidCountry("england")).toBe(true);
    expect(isValidCountry("scotland")).toBe(true);
    expect(isValidCountry("wales")).toBe(true);
    expect(isValidCountry("northern ireland")).toBe(true);
  });

  it("should return false for invalid countries", () => {
    expect(isValidCountry("")).toBe(false);
    expect(isValidCountry("Ireland")).toBe(false);
    expect(isValidCountry("England")).toBe(false);
  });
});

describe("isValidDosageTotal", () => {
  it("should return true for increasing prescription with zero dosage", () => {
    expect(isValidDosageTotal("increasing", 0)).toBe(true);
  });

  it("should return true for non-zero dosages with any prescription type", () => {
    expect(isValidDosageTotal("stabilisation", 10)).toBe(true);
    expect(isValidDosageTotal("reducing", 20)).toBe(true);
    expect(isValidDosageTotal("increasing", 15)).toBe(true);
  });

  it("should return false for zero dosage with non-increasing types", () => {
    expect(isValidDosageTotal("stabilisation", 0)).toBe(false);
    expect(isValidDosageTotal("reducing", 0)).toBe(false);
  });
});
