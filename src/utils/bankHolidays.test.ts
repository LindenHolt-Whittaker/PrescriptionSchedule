import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchUKBankHolidays, isBankHoliday } from "./bankHolidays";

describe("isBankHoliday", () => {
  it("should return true when date is in bank holiday set", () => {
    const bankHolidays = new Set(["2024-12-25", "2024-12-26"]);
    const date = new Date("2024-12-25");
    expect(isBankHoliday(date, bankHolidays)).toBe(true);
  });

  it("should return false when date is not in bank holiday set", () => {
    const bankHolidays = new Set(["2024-12-25", "2024-12-26"]);
    const date = new Date("2024-12-27");
    expect(isBankHoliday(date, bankHolidays)).toBe(false);
  });

  it("should return false when bank holiday set is empty", () => {
    const bankHolidays = new Set<string>();
    const date = new Date("2024-12-25");
    expect(isBankHoliday(date, bankHolidays)).toBe(false);
  });
});

describe("fetchUKBankHolidays", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return empty set when division is empty string", async () => {
    const result = await fetchUKBankHolidays("");
    expect(result.size).toBe(0);
  });

  it("should fetch and return bank holidays for england", async () => {
    const mockResponse = {
      "england-and-wales": {
        division: "england-and-wales",
        events: [
          { title: "Christmas Day", date: "2024-12-25" },
          { title: "Boxing Day", date: "2024-12-26" },
        ],
      },
      scotland: { division: "scotland", events: [] },
      "northern-ireland": { division: "northern-ireland", events: [] },
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      })
    ) as never;

    const result = await fetchUKBankHolidays("england");
    expect(result.size).toBe(2);
    expect(result.has("2024-12-25")).toBe(true);
    expect(result.has("2024-12-26")).toBe(true);
  });

  it("should fetch and return bank holidays for scotland", async () => {
    const mockResponse = {
      "england-and-wales": { division: "england-and-wales", events: [] },
      scotland: {
        division: "scotland",
        events: [{ title: "New Year", date: "2024-01-01" }],
      },
      "northern-ireland": { division: "northern-ireland", events: [] },
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      })
    ) as never;

    const result = await fetchUKBankHolidays("scotland");
    expect(result.size).toBe(1);
    expect(result.has("2024-01-01")).toBe(true);
  });

  it("should handle wales division correctly", async () => {
    const mockResponse = {
      "england-and-wales": {
        division: "england-and-wales",
        events: [{ title: "Bank Holiday", date: "2024-05-06" }],
      },
      scotland: { division: "scotland", events: [] },
      "northern-ireland": { division: "northern-ireland", events: [] },
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      })
    ) as never;

    const result = await fetchUKBankHolidays("wales");
    expect(result.size).toBe(1);
    expect(result.has("2024-05-06")).toBe(true);
  });

  it("should handle northern ireland division correctly", async () => {
    const mockResponse = {
      "england-and-wales": { division: "england-and-wales", events: [] },
      scotland: { division: "scotland", events: [] },
      "northern-ireland": {
        division: "northern-ireland",
        events: [{ title: "St Patrick's Day", date: "2024-03-17" }],
      },
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      })
    ) as never;

    const result = await fetchUKBankHolidays("northern ireland");
    expect(result.size).toBe(1);
    expect(result.has("2024-03-17")).toBe(true);
  });

  it("should return empty set when fetch fails", async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error("Network error"))
    ) as never;

    const result = await fetchUKBankHolidays("england");
    expect(result.size).toBe(0);
  });
});
