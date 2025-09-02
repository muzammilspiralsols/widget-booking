import {
  formatDate,
  addDays,
  isMobile,
  debounce,
  createElement,
  isDateInRange,
  getDaysBetween,
  isValidDateRange,
  getMonthName,
  getWeekdayNames,
  formatPrice,
  t,
} from "../src/utils/utils";
import { cleanupDOM } from "./setup";

// Mock window.innerWidth for mobile tests
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1200,
});

describe("Utility Functions Tests", () => {
  afterEach(() => {
    cleanupDOM();
    // Reset window width
    window.innerWidth = 1200;
  });

  describe("formatDate", () => {
    const testDate = new Date(2024, 0, 15); // January 15, 2024

    test("should format date with default format (dd-MM-yyyy)", () => {
      expect(formatDate(testDate)).toBe("15-01-2024");
    });

    test("should format date with yyyy-MM-dd format", () => {
      expect(formatDate(testDate, "yyyy-MM-dd")).toBe("2024-01-15");
    });

    test("should format date with MM/dd/yyyy format", () => {
      expect(formatDate(testDate, "MM/dd/yyyy")).toBe("01/15/2024");
    });

    test("should handle single digit months and days", () => {
      const singleDigitDate = new Date(2024, 2, 5); // March 5, 2024
      expect(formatDate(singleDigitDate)).toBe("05-03-2024");
      expect(formatDate(singleDigitDate, "yyyy-MM-dd")).toBe("2024-03-05");
    });

    test("should fallback to default format for unknown format", () => {
      expect(formatDate(testDate, "unknown-format")).toBe("15-01-2024");
    });
  });

  describe("addDays", () => {
    test("should add positive days", () => {
      const date = new Date(2024, 0, 15);
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(20);
      expect(result.getMonth()).toBe(0);
    });

    test("should subtract days with negative input", () => {
      const date = new Date(2024, 0, 15);
      const result = addDays(date, -5);
      expect(result.getDate()).toBe(10);
      expect(result.getMonth()).toBe(0);
    });

    test("should handle month boundaries", () => {
      const date = new Date(2024, 0, 30);
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(4);
      expect(result.getMonth()).toBe(1); // February
    });

    test("should not modify original date", () => {
      const originalDate = new Date(2024, 0, 15);
      const originalTime = originalDate.getTime();
      addDays(originalDate, 5);
      expect(originalDate.getTime()).toBe(originalTime);
    });
  });

  describe("isMobile", () => {
    test("should return false for desktop width", () => {
      window.innerWidth = 1200;
      expect(isMobile()).toBe(false);
    });

    test("should return true for mobile width", () => {
      window.innerWidth = 800;
      expect(isMobile()).toBe(true);
    });

    test("should return false for exactly 1024px (boundary)", () => {
      window.innerWidth = 1024;
      expect(isMobile()).toBe(false);
    });

    test("should return false for width above 1024px", () => {
      window.innerWidth = 1025;
      expect(isMobile()).toBe(false);
    });
  });

  describe("debounce", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("should delay function execution", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test("should reset timer on multiple calls", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      jest.advanceTimersByTime(50);
      debouncedFn(); // Reset timer
      jest.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test("should pass arguments correctly", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn("arg1", "arg2");
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
    });
  });

  describe("createElement", () => {
    test("should create element with tag only", () => {
      const element = createElement("div");
      expect(element.tagName).toBe("DIV");
      expect(element.className).toBe("");
      expect(element.textContent).toBe("");
    });

    test("should create element with class name", () => {
      const element = createElement("div", "test-class");
      expect(element.tagName).toBe("DIV");
      expect(element.className).toBe("test-class");
    });

    test("should create element with text content", () => {
      const element = createElement("span", "", "Test text");
      expect(element.tagName).toBe("SPAN");
      expect(element.textContent).toBe("Test text");
    });

    test("should create element with class and text", () => {
      const element = createElement("p", "paragraph", "Hello world");
      expect(element.tagName).toBe("P");
      expect(element.className).toBe("paragraph");
      expect(element.textContent).toBe("Hello world");
    });
  });

  describe("isDateInRange", () => {
    const startDate = new Date(2024, 0, 10);
    const endDate = new Date(2024, 0, 20);

    test("should return true for date within range", () => {
      const testDate = new Date(2024, 0, 15);
      expect(isDateInRange(testDate, startDate, endDate)).toBe(true);
    });

    test("should return true for start date", () => {
      expect(isDateInRange(startDate, startDate, endDate)).toBe(true);
    });

    test("should return true for end date", () => {
      expect(isDateInRange(endDate, startDate, endDate)).toBe(true);
    });

    test("should return false for date before range", () => {
      const testDate = new Date(2024, 0, 5);
      expect(isDateInRange(testDate, startDate, endDate)).toBe(false);
    });

    test("should return false for date after range", () => {
      const testDate = new Date(2024, 0, 25);
      expect(isDateInRange(testDate, startDate, endDate)).toBe(false);
    });
  });

  describe("getDaysBetween", () => {
    test("should calculate days between dates", () => {
      const start = new Date(2024, 0, 10);
      const end = new Date(2024, 0, 15);
      expect(getDaysBetween(start, end)).toBe(5);
    });

    test("should handle same date", () => {
      const date = new Date(2024, 0, 10);
      expect(getDaysBetween(date, date)).toBe(0);
    });

    test("should handle month boundaries", () => {
      const start = new Date(2024, 0, 30);
      const end = new Date(2024, 1, 2);
      expect(getDaysBetween(start, end)).toBe(3);
    });
  });

  describe("isValidDateRange", () => {
    test("should return true for valid range", () => {
      const checkIn = new Date(2024, 0, 10);
      const checkOut = new Date(2024, 0, 15);
      expect(isValidDateRange(checkIn, checkOut)).toBe(true);
    });

    test("should return false for same dates", () => {
      const date = new Date(2024, 0, 10);
      expect(isValidDateRange(date, date)).toBe(false);
    });

    test("should return false for reversed dates", () => {
      const checkIn = new Date(2024, 0, 15);
      const checkOut = new Date(2024, 0, 10);
      expect(isValidDateRange(checkIn, checkOut)).toBe(false);
    });
  });

  describe("getMonthName", () => {
    test("should return month name in English", () => {
      const date = new Date(2024, 0, 15);
      expect(getMonthName(date, "en-US")).toBe("January");
    });

    test("should return month name in Spanish", () => {
      const date = new Date(2024, 0, 15);
      expect(getMonthName(date, "es-ES")).toBe("enero");
    });

    test("should use default locale", () => {
      const date = new Date(2024, 5, 15);
      const result = getMonthName(date);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("getWeekdayNames", () => {
    test("should return 7 weekday names", () => {
      const weekdays = getWeekdayNames("en-US");
      expect(weekdays).toHaveLength(7);
      expect(weekdays[0]).toBe("Sun");
      expect(weekdays[6]).toBe("Sat");
    });

    test("should return weekdays in Spanish", () => {
      const weekdays = getWeekdayNames("es-ES");
      expect(weekdays).toHaveLength(7);
      expect(typeof weekdays[0]).toBe("string");
    });

    test("should use default locale", () => {
      const weekdays = getWeekdayNames();
      expect(weekdays).toHaveLength(7);
      weekdays.forEach((day) => {
        expect(typeof day).toBe("string");
        expect(day.length).toBeGreaterThan(0);
      });
    });
  });

  describe("formatPrice", () => {
    test("should format price without currency", () => {
      expect(formatPrice(100)).toBe("$100");
    });

    test("should format USD correctly", () => {
      expect(formatPrice(100, "USD")).toBe("$100");
    });

    test("should format EUR correctly", () => {
      expect(formatPrice(100, "EUR")).toBe("€100");
    });

    test("should format GBP correctly", () => {
      expect(formatPrice(100, "GBP")).toBe("£100");
    });

    test("should format suffix currencies correctly", () => {
      expect(formatPrice(100, "SEK")).toBe("100 kr");
      expect(formatPrice(100, "NOK")).toBe("100 kr");
      expect(formatPrice(100, "PLN")).toBe("100 zł");
    });

    test("should handle unknown currency", () => {
      expect(formatPrice(100, "XYZ")).toBe("XYZ100");
    });

    test("should handle case insensitive currency", () => {
      expect(formatPrice(100, "usd")).toBe("$100");
      expect(formatPrice(100, "eur")).toBe("€100");
    });
  });

  describe("t (translation function)", () => {
    test("should return English translation by default", () => {
      expect(t("field.where")).toBe("Where");
      expect(t("search.button")).toBe("Search");
    });

    test("should return Spanish translation", () => {
      expect(t("field.where", "es")).toBe("Dónde");
      expect(t("search.button", "es-ES")).toBe("Buscar");
    });

    test("should handle exact locale match", () => {
      expect(t("field.where", "es-ES")).toBe("Dónde");
    });

    test("should fallback to short locale", () => {
      expect(t("field.where", "es-MX")).toBe("Dónde");
    });

    test("should fallback to English for unknown locale", () => {
      expect(t("field.where", "fr-FR")).toBe("Where");
    });

    test("should return key for missing translation", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      expect(t("missing.key")).toBe("missing.key");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Missing translation for key: missing.key"
      );
      consoleSpy.mockRestore();
    });

    test("should handle case insensitive locale", () => {
      expect(t("field.where", "ES-es")).toBe("Dónde");
    });

    test("should handle occupancy translations", () => {
      expect(t("occupancy.adults", "en")).toBe("Adults");
      expect(t("occupancy.children", "es")).toBe("Niños");
    });

    test("should handle hotel translations", () => {
      expect(t("hotel.select", "en")).toBe("Select Hotel");
      expect(t("hotel.all", "es")).toBe("Todos los Hoteles");
    });
  });
});
