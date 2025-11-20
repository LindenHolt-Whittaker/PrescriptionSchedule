import { describe, it, expect } from "vitest";
import { encodePrescriptionData, decodePrescriptionKey } from "./scheduleKey";
import type { PrescriptionData } from "../types/prescriptionData";
import type { AvailableDays } from "../types/days";

describe("scheduleKey encoding/decoding", () => {
  const testAvailableDays: AvailableDays = {
    monday: true,
    tuesday: false,
    wednesday: true,
    thursday: false,
    friday: true,
    saturday: false,
    sunday: false,
  };

  describe("encodePrescriptionData", () => {
    it("should encode stabilisation prescription", () => {
      const data: PrescriptionData = {
        country: "england",
        initialDate: new Date("2024-03-15"),
        availableDays: testAvailableDays,
        prescriptionType: "stabilisation",
        dosage: 30,
      };

      const encoded = encodePrescriptionData(data);
      expect(encoded).toBe("fmFYC6y");
    });

    it("should encode reducing prescription with change fields", () => {
      const data: PrescriptionData = {
        country: "scotland",
        initialDate: new Date("2024-06-01"),
        availableDays: testAvailableDays,
        prescriptionType: "reducing",
        dosage: 40,
        changeAmount: 5,
        changeFrequency: 7,
      };

      const encoded = encodePrescriptionData(data);
      expect(encoded).toBe("g96ZBMl");
    });

    it("should encode increasing prescription", () => {
      const data: PrescriptionData = {
        country: "wales",
        initialDate: new Date("2024-01-01"),
        availableDays: testAvailableDays,
        prescriptionType: "increasing",
        dosage: 0,
        changeAmount: 2,
        changeFrequency: 3,
      };

      const encoded = encodePrescriptionData(data);
      expect(encoded).toBe("fQZGYap");
    });
  });

  describe("round-trip encoding/decoding", () => {
    it("should preserve stabilisation prescription data", () => {
      const original: PrescriptionData = {
        country: "england",
        initialDate: new Date("2024-03-15"),
        availableDays: testAvailableDays,
        prescriptionType: "stabilisation",
        dosage: 30,
      };

      const encoded = encodePrescriptionData(original);
      const decoded: PrescriptionData | null = decodePrescriptionKey(encoded);

      expect(decoded).not.toBeNull();
      expect(decoded?.country).toBe(original.country);
      expect(decoded?.prescriptionType).toBe(original.prescriptionType);
      expect(decoded?.dosage).toBe(original.dosage);
      expect(decoded?.availableDays).toEqual(original.availableDays);
    });

    it("should preserve reducing prescription with all fields", () => {
      const original: PrescriptionData = {
        country: "scotland",
        initialDate: new Date("2024-06-01"),
        availableDays: testAvailableDays,
        prescriptionType: "reducing",
        dosage: 50,
        changeAmount: 10,
        changeFrequency: 14,
      };

      const encoded = encodePrescriptionData(original);
      const decoded: PrescriptionData | null = decodePrescriptionKey(encoded);

      expect(decoded).not.toBeNull();
      expect(decoded?.country).toBe(original.country);
      expect(decoded?.prescriptionType).toBe(original.prescriptionType);
      expect(decoded?.dosage).toBe(original.dosage);
      expect(decoded?.changeAmount).toBe(original.changeAmount);
      expect(decoded?.changeFrequency).toBe(original.changeFrequency);
    });

    it("should preserve increasing prescription", () => {
      const original: PrescriptionData = {
        country: "wales",
        initialDate: new Date("2025-01-01"),
        availableDays: testAvailableDays,
        prescriptionType: "increasing",
        dosage: 5,
        changeAmount: 3,
        changeFrequency: 7,
      };

      const encoded = encodePrescriptionData(original);
      const decoded: PrescriptionData | null = decodePrescriptionKey(encoded);

      expect(decoded).not.toBeNull();
      expect(decoded?.prescriptionType).toBe("increasing");
      expect(decoded?.dosage).toBe(original.dosage);
      expect(decoded?.changeAmount).toBe(original.changeAmount);
    });

    it("should handle northern ireland country", () => {
      const original: PrescriptionData = {
        country: "northern ireland",
        initialDate: new Date("2024-12-25"),
        availableDays: testAvailableDays,
        prescriptionType: "stabilisation",
        dosage: 20,
      };

      const encoded = encodePrescriptionData(original);
      const decoded: PrescriptionData | null = decodePrescriptionKey(encoded);

      expect(decoded?.country).toBe("northern ireland");
    });

    it("should handle all weekdays selected", () => {
      const allDays: AvailableDays = {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      };

      const original: PrescriptionData = {
        country: "england",
        initialDate: new Date("2024-03-15"),
        availableDays: allDays,
        prescriptionType: "stabilisation",
        dosage: 25,
      };

      const encoded = encodePrescriptionData(original);
      const decoded: PrescriptionData | null = decodePrescriptionKey(encoded);

      expect(decoded?.availableDays).toEqual(allDays);
    });

    it("should handle minimum values", () => {
      const minDays: AvailableDays = {
        monday: true,
        tuesday: true,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      };

      const original: PrescriptionData = {
        country: "england",
        initialDate: new Date("2000-01-01"),
        availableDays: minDays,
        prescriptionType: "increasing",
        dosage: 0,
        changeAmount: 1,
        changeFrequency: 1,
      };

      const encoded = encodePrescriptionData(original);
      const decoded: PrescriptionData | null = decodePrescriptionKey(encoded);

      expect(decoded).not.toBeNull();
      expect(decoded?.dosage).toBe(0);
      expect(decoded?.changeAmount).toBe(1);
      expect(decoded?.changeFrequency).toBe(1);
    });

    it("should handle maximum values", () => {
      const original: PrescriptionData = {
        country: "england",
        initialDate: new Date("2024-12-31"),
        availableDays: testAvailableDays,
        prescriptionType: "reducing",
        dosage: 60,
        changeAmount: 30,
        changeFrequency: 14,
      };

      const encoded = encodePrescriptionData(original);
      const decoded: PrescriptionData | null = decodePrescriptionKey(encoded);

      expect(decoded).not.toBeNull();
      expect(decoded?.dosage).toBe(60);
      expect(decoded?.changeAmount).toBe(30);
      expect(decoded?.changeFrequency).toBe(14);
    });
  });
});
