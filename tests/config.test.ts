import {
  parseConfig,
  getHotelGroups,
  getHotelById,
  MOCK_HOTELS,
} from "../src/types/config";
import { createWidgetContainer, cleanupDOM } from "./setup";

describe("Configuration Tests", () => {
  afterEach(() => {
    cleanupDOM();
  });

  describe("parseConfig", () => {
    test("should parse default configuration", () => {
      const container = createWidgetContainer();
      const config = parseConfig(container);

      expect(config.bookId).toBe("12345");
      expect(config.type).toBe("hotel");
      expect(config.layout).toBe("inline");
      expect(config.defaultAdults).toBe(2);
      expect(config.defaultChildren).toBe(0);
      expect(config.maxAdults).toBe(4);
      expect(config.theme).toBe("light");
      expect(config.showPromoCode).toBe(true);
    });

    test("should parse hotel type configuration", () => {
      const container = createWidgetContainer("widget-test", {
        "data-type": "hotel",
        "data-layout": "column",
        "data-theme": "dark",
      });
      const config = parseConfig(container);

      expect(config.type).toBe("hotel");
      expect(config.layout).toBe("column");
      expect(config.theme).toBe("dark");
      expect(config.showHotelSelector).toBe(false); // Should be false for hotel type
    });

    test("should parse chain type configuration", () => {
      const container = createWidgetContainer("widget-test", {
        "data-type": "chain",
        "data-hotel": "playa-garden-selection-hotel-spa",
        "data-currency": "EUR",
        "data-locale": "es-ES",
      });
      const config = parseConfig(container);

      expect(config.type).toBe("chain");
      expect(config.hotel).toBe("playa-garden-selection-hotel-spa");
      expect(config.currency).toBe("EUR");
      expect(config.locale).toBe("es-ES");
      expect(config.showHotelSelector).toBe(true); // Should be true for chain type
    });

    test("should parse numeric configurations", () => {
      const container = createWidgetContainer("widget-test", {
        "data-default-adults": "4",
        "data-default-children": "2",
        "data-max-adults": "8",
        "data-max-children": "6",
        "data-max-rooms": "3",
        "data-min-child-age": "2",
        "data-max-child-age": "15",
      });
      const config = parseConfig(container);

      expect(config.defaultAdults).toBe(4);
      expect(config.defaultChildren).toBe(2);
      expect(config.maxAdults).toBe(8);
      expect(config.maxChildren).toBe(6);
      expect(config.maxRooms).toBe(3);
      expect(config.minChildAge).toBe(2);
      expect(config.maxChildAge).toBe(15);
    });

    test("should parse date constraints", () => {
      const container = createWidgetContainer("widget-test", {
        "data-min-date": "2024-01-01",
        "data-max-date": "2024-12-31",
      });
      const config = parseConfig(container);

      expect(config.minDate).toEqual(new Date(2024, 0, 1)); // Month is 0-indexed
      expect(config.maxDate).toEqual(new Date(2024, 11, 31));
    });

    test("should handle invalid date formats gracefully", () => {
      const container = createWidgetContainer("widget-test", {
        "data-min-date": "invalid-date",
        "data-max-date": "2024-13-45", // Invalid month/day
      });
      const config = parseConfig(container);

      expect(config.minDate).toBeUndefined();
      expect(config.maxDate).toBeUndefined();
    });

    test("should parse boolean configurations", () => {
      const container = createWidgetContainer("widget-test", {
        "data-show-promo-code": "false",
      });
      const config = parseConfig(container);

      expect(config.showPromoCode).toBe(false);
    });

    test("should handle missing required bookId", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      const container = document.createElement("div");
      container.id = "test-widget";
      document.body.appendChild(container);

      const config = parseConfig(container);

      expect(config.bookId).toBe("");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Widget Search: data-book-id is required"
      );

      consoleSpy.mockRestore();
    });

    test("should handle alternative attribute names", () => {
      const container = document.createElement("div");
      container.id = "test-widget";
      container.setAttribute("data-hotel-id", "alt-hotel-123"); // Alternative to data-book-id
      container.setAttribute("data-language", "fr-FR"); // Alternative to data-locale
      document.body.appendChild(container);

      const config = parseConfig(container);

      expect(config.bookId).toBe("alt-hotel-123");
      expect(config.locale).toBe("fr-FR");
    });

    test("should set hotel selector visibility for chain with hotel", () => {
      const container = createWidgetContainer("widget-test", {
        "data-type": "chain",
        "data-hotel": "some-hotel-id",
      });
      const config = parseConfig(container);

      expect(config.showHotelSelector).toBe(true);
      expect(config.hotel).toBe("some-hotel-id");
    });
  });

  describe("Hotel Data Functions", () => {
    test("getHotelGroups should return grouped hotels by location", () => {
      const groups = getHotelGroups();

      expect(groups).toBeInstanceOf(Array);
      expect(groups.length).toBeGreaterThan(0);

      // Check that each group has location and hotels
      groups.forEach((group) => {
        expect(group).toHaveProperty("location");
        expect(group).toHaveProperty("hotels");
        expect(group.hotels).toBeInstanceOf(Array);
        expect(group.hotels.length).toBeGreaterThan(0);
      });

      // Check that "all-hotels" is not included in groups
      const allHotelsInGroups = groups.flatMap((g) => g.hotels);
      const hasAllHotels = allHotelsInGroups.some((h) => h.id === "all-hotels");
      expect(hasAllHotels).toBe(false);
    });

    test("getHotelById should return correct hotel", () => {
      const hotel = getHotelById("playa-garden-selection-hotel-spa");

      expect(hotel).toBeDefined();
      expect(hotel?.id).toBe("playa-garden-selection-hotel-spa");
      expect(hotel?.name).toBe("Playa Garden Selection Hotel & Spa");
      expect(hotel?.location).toBe("Playa de Palma");
    });

    test("getHotelById should return undefined for non-existent hotel", () => {
      const hotel = getHotelById("non-existent-hotel");
      expect(hotel).toBeUndefined();
    });

    test("getHotelById should return all-hotels option", () => {
      const hotel = getHotelById("all-hotels");

      expect(hotel).toBeDefined();
      expect(hotel?.id).toBe("all-hotels");
      expect(hotel?.name).toBe("All Hotels");
    });

    test("MOCK_HOTELS should contain expected data structure", () => {
      expect(MOCK_HOTELS).toBeInstanceOf(Array);
      expect(MOCK_HOTELS.length).toBeGreaterThan(10);

      // Check first hotel structure
      const firstHotel = MOCK_HOTELS[0];
      expect(firstHotel).toHaveProperty("id");
      expect(firstHotel).toHaveProperty("name");
      expect(firstHotel).toHaveProperty("location");
      expect(firstHotel).toHaveProperty("city");
      expect(firstHotel).toHaveProperty("country");
    });

    test("should have unique hotel IDs", () => {
      const ids = MOCK_HOTELS.map((h) => h.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
