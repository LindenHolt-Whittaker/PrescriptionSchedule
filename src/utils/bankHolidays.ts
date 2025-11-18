interface BankHolidayEvent {
  title: string;
  date: string;
  notes?: string;
  bunting?: boolean;
}

interface BankHolidayDivision {
  division: string;
  events: BankHolidayEvent[];
}

interface BankHolidaysResponse {
  "england-and-wales": BankHolidayDivision;
  scotland: BankHolidayDivision;
  "northern-ireland": BankHolidayDivision;
}

export const fetchUKBankHolidays = async (
  division:
    | "england-and-wales"
    | "scotland"
    | "northern-ireland"
): Promise<Set<string>> => {
  try {
    const response = await fetch("https://www.gov.uk/bank-holidays.json");
    const data: BankHolidaysResponse = await response.json();

    const dates = new Set(data[division].events.map((event) => event.date));

    return dates;
  } catch (error) {
    console.error("Failed to fetch bank holidays:", error);
    return new Set();
  }
};

export const isBankHoliday = (
  date: Date,
  bankHolidays: Set<string>
): boolean => {
  const dateString = date.toISOString().split("T")[0];
  return bankHolidays.has(dateString);
};
