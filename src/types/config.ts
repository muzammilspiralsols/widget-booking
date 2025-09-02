export interface WidgetConfig {
  bookId: string;
  type: "hotel" | "chain";
  hotel?: string;
  currency?: string;
  locale?: string;
  layout: "inline" | "column" | "expand";
  defaultAdults: number;
  defaultChildren: number;
  defaultRooms: number;
  maxAdults: number;
  maxChildren: number;
  maxRooms: number;
  minChildAge: number;
  maxChildAge: number;
  baseUrl: string;
  urlChain: string;
  urlHotel: string;
  apiUrl?: string;
  showPromoCode: boolean;
  showHotelSelector: boolean;
  showPrice: boolean;
  minDate?: Date;
  maxDate?: Date;
  dateFormat: string;
  theme: "light" | "dark";
  showCheckinOnline: boolean;
  checkinOnlineUrl?: string;
  checkinOnlineText?: string;
  // New parameters for external URL redirection
  externalUrl?: string;
  externalUrlParams?: Record<string, string>;
}

const DEFAULT_CONFIG: WidgetConfig = {
  bookId: "",
  type: "hotel",
  layout: "inline",
  defaultAdults: 2,
  defaultChildren: 0,
  defaultRooms: 1,
  maxAdults: 4,
  maxChildren: 4,
  maxRooms: 5,
  minChildAge: 0,
  maxChildAge: 17,
  baseUrl: "",
  urlChain: "",
  urlHotel: "",
  showPromoCode: true,
  showHotelSelector: true,
  showPrice: true,
  dateFormat: "dd-MM-yyyy",
  theme: "light",
  showCheckinOnline: false,
  checkinOnlineUrl: "",
  checkinOnlineText: "Check-in Online",
};

export function parseConfig(container: HTMLElement): WidgetConfig {
  const dataset = container.dataset;

  const config: WidgetConfig = {
    ...DEFAULT_CONFIG,
    // Required attributes according to specification
    bookId: dataset.bookId || dataset.hotelId || "",
    type: (dataset.type as "hotel" | "chain") || "hotel",
    
    // Optional attributes with proper mapping
    hotel: dataset.hotel,
    currency: dataset.currency,
    locale: dataset.locale || dataset.language,
    layout: (dataset.layout as "inline" | "column" | "expand") || "inline",
    
    // Guest configuration
    defaultAdults: parseInt(dataset.defaultAdults || "2"),
    defaultChildren: parseInt(dataset.defaultChildren || "0"),
    defaultRooms: parseInt(dataset.defaultRooms || "1"),
    maxAdults: parseInt(dataset.maxAdults || "4"),
    maxChildren: parseInt(dataset.maxChildren || "4"),
    maxRooms: parseInt(dataset.maxRooms || "5"),
    minChildAge: parseInt(dataset.minChildAge || "0"),
    maxChildAge: parseInt(dataset.maxChildAge || "17"),
    
    // URL configuration
    baseUrl: dataset.baseUrl || DEFAULT_CONFIG.baseUrl,
    urlChain: dataset.urlChain || DEFAULT_CONFIG.urlChain,
    urlHotel: dataset.urlHotel || DEFAULT_CONFIG.urlHotel,
    apiUrl: dataset.apiUrl,
    
    // Feature toggles
    showPromoCode: dataset.showPromoCode !== "false",
    showHotelSelector: dataset.type === "chain",
    showPrice: dataset.showPrice !== "false",
    
    // Date configuration
    dateFormat: dataset.dateFormat || "dd-MM-yyyy",
    minDate: undefined, // Will be set below if valid
    maxDate: undefined, // Will be set below if valid
    
    // Theme and styling
    theme: (dataset.theme as "light" | "dark") || "light",
    
    // Check-in online configuration
    showCheckinOnline: dataset.showCheckinOnline === "true",
    checkinOnlineUrl: dataset.checkinOnlineUrl || DEFAULT_CONFIG.checkinOnlineUrl,
    checkinOnlineText: dataset.checkinOnlineText || DEFAULT_CONFIG.checkinOnlineText,
    
    // External URL configuration
    externalUrl: dataset.externalUrl,
    externalUrlParams: dataset.externalUrlParams ? JSON.parse(dataset.externalUrlParams) : undefined,
  };

  // Validate required fields
  if (!config.bookId) {
    console.warn("Widget Search: data-book-id is required");
  }

  // Set date limits - parse as local dates to avoid timezone issues
  if (dataset.minDate) {
    // Parse YYYY-MM-DD as local date (not UTC)
    const parts = dataset.minDate.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // months are 0-indexed
      const day = parseInt(parts[2]);

      // Validate that the parsed values are reasonable
      if (
        !isNaN(year) &&
        !isNaN(month) &&
        !isNaN(day) &&
        year > 1900 &&
        year < 3000 &&
        month >= 0 &&
        month <= 11 &&
        day >= 1 &&
        day <= 31
      ) {
        const date = new Date(year, month, day);
        // Check if the date is valid (JavaScript auto-corrects invalid dates)
        if (
          date.getFullYear() === year &&
          date.getMonth() === month &&
          date.getDate() === day
        ) {
          config.minDate = date;
        }
      }
    }
  }

  if (dataset.maxDate) {
    // Parse YYYY-MM-DD as local date (not UTC)
    const parts = dataset.maxDate.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // months are 0-indexed
      const day = parseInt(parts[2]);

      // Validate that the parsed values are reasonable
      if (
        !isNaN(year) &&
        !isNaN(month) &&
        !isNaN(day) &&
        year > 1900 &&
        year < 3000 &&
        month >= 0 &&
        month <= 11 &&
        day >= 1 &&
        day <= 31
      ) {
        const date = new Date(year, month, day);
        // Check if the date is valid (JavaScript auto-corrects invalid dates)
        if (
          date.getFullYear() === year &&
          date.getMonth() === month &&
          date.getDate() === day
        ) {
          config.maxDate = date;
        }
      }
    }
  }

  // If hotel is specified via data-hotel, select it by default
  if (config.hotel && config.type === "chain") {
    config.showHotelSelector = true;
  }

  return config;
}

// Hotel data structure (this would come from API in real implementation)
export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
}

export interface HotelGroup {
  location: string;
  hotels: Hotel[];
}

// Mock hotel data - in real implementation this would come from API
export const MOCK_HOTELS: Hotel[] = [
  {
    id: "all-hotels",
    name: "All Hotels",
    location: "All Locations",
    city: "All",
    country: "All",
  },
  {
    id: "playa-garden-selection-hotel-spa",
    name: "Playa Garden Selection Hotel & Spa",
    location: "Playa de Palma",
    city: "Palma",
    country: "Spain",
  },
  {
    id: "alcudia-garden-aparthotel",
    name: "Alcudia Garden Aparthotel",
    location: "Alcudia",
    city: "Alcudia",
    country: "Spain",
  },
  {
    id: "palm-garden-apartments",
    name: "Palm Garden Apartments",
    location: "Playa de Palma",
    city: "Palma",
    country: "Spain",
  },
  {
    id: "garden-saladina",
    name: "Garden Saladina",
    location: "Saladina",
    city: "Saladina",
    country: "Spain",
  },
  {
    id: "green-garden-aparthotel",
    name: "Green Garden Aparthotel",
    location: "Alcudia",
    city: "Alcudia",
    country: "Spain",
  },
  {
    id: "cala-millor-garden-hotel",
    name: "Cala Millor Garden Hotel",
    location: "Cala Millor",
    city: "Cala Millor",
    country: "Spain",
  },
  {
    id: "hyb-eurocalas",
    name: "HYB Eurocalas",
    location: "Calas de Mallorca",
    city: "Calas de Mallorca",
    country: "Spain",
  },
  {
    id: "nivia-born-boutique-hotel",
    name: "Nivia Born Boutique Hotel",
    location: "Palma Centro",
    city: "Palma",
    country: "Spain",
  },
  {
    id: "gomila-palma-apartments",
    name: "Gomila Palma Apartments",
    location: "Palma Centro",
    city: "Palma",
    country: "Spain",
  },
  {
    id: "tropic-garden-hotel-apartments",
    name: "Tropic Garden Hotel Apartments",
    location: "Santa Eulalia",
    city: "Santa Eulalia",
    country: "Spain",
  },
  {
    id: "marinda-garden-aparthotel",
    name: "Marinda Garden Aparthotel",
    location: "Cala Millor",
    city: "Cala Millor",
    country: "Spain",
  },
  {
    id: "garden-playanatural-hotel-spa",
    name: "Garden Playanatural Hotel & Spa",
    location: "Playa de Palma",
    city: "Palma",
    country: "Spain",
  },
  {
    id: "nivia-punta-cana",
    name: "Nivia Punta Cana",
    location: "Punta Cana",
    city: "Punta Cana",
    country: "Dominican Republic",
  },
];

export const MOCK_HOTELS_FERGUS: Hotel[] = [
  {
    id: "all-hotels",
    name: "Todos los hoteles",
    location: "All Locations",
    city: "All",
    country: "All",
  },
  {
    id: "fergus_style_tobago",
    name: "FERGUS Style Tobago",
    location: "Mallorca",
    city: "Baleares",
    country: "Spain",
  },
  {
    id: "fergus_palmanovapark",
    name: "FERGUS Style Palmanova Park",
    location: "Mallorca",
    city: "Baleares",
    country: "Spain",
  },
  {
    id: "fergus_bermudas",
    name: "FERGUS Bermudas",
    location: "Mallorca",
    city: "Baleares",
    country: "Spain",
  },
  {
    id: "fergus_mallorcawater",
    name: "FERGUS Club Mallorca Waterpark",
    location: "Mallorca",
    city: "Baleares",
    country: "Spain",
  },
  {
    id: "fergus_clubeuropa",
    name: "FERGUS Club Europa",
    location: "Mallorca",
    city: "Baleares",
    country: "Spain",
  },
  {
    id: "fergus_palmabeach",
    name: "FERGUS Style Palma Beach",
    location: "Mallorca",
    city: "Baleares",
    country: "Spain",
  },
  {
    id: "fergus_style_sollerbeach",
    name: "FERGUS Style Soller Beach",
    location: "Mallorca",
    city: "Baleares",
    country: "Spain",
  },
  {
    id: "fergus_style_calablancasuites",
    name: "FERGUS Style Cala Blanca Suites ",
    location: "Mallorca",
    city: "Baleares",
    country: "Spain",
  },
  {
    id: "fergus_style_bahamas",
    name: "FERGUS Style Bahamas",
    location: "Ibiza",
    city: "Baleares",
    country: "Spain",
  },
  {
    id: "fergus_puntaarabi",
    name: "FERGUS Style Punta Arabi",
    location: "Ibiza",
    city: "Baleares",
    country: "Spain",
  },
  {
    id: "fergus_stylecaremabech",
    name: "FERGUS Style Carema Beach",
    location: "Menorca",
    city: "Baleares",
    country: "Spain",
  },
  {
    id: "fergus_clubcaremasplash",
    name: "FERGUS Club Carema Splash",
    location: "Menorca",
    city: "Baleares",
    country: "Spain",
  },
  {
    id: "fergus_puertodelacruz",
    name: "FERGUS Puerto de la Cruz",
    location: "Tenerife",
    city: "Canarias",
    country: "Spain",
  },
  {
    id: "fergus_cactus",
    name: "FERGUS Cactus Garden",
    location: "Fuerteventura",
    city: "Canarias",
    country: "Spain",
  },
  {
    id: "fergus_conilpark",
    name: "FERGUS Conil Park",
    location: "Cadiz",
    city: "Andalucia",
    country: "Spain",
  },
  {
    id: "fergus_caproignature",
    name: "FERGUS Cap Roig",
    location: "Tarragona",
    city: "Cataluñna",
    country: "Spain",
  },
  {
    id: "fergus_clubpinedasplash",
    name: "FERGUS Club Pineda Splash",
    location: "Cataluñna",
    city: "Cataluñna",
    country: "Spain",
  },
  {
    id: "fergus_laspalmeras",
    name: "Las Palmeras Affiliated",
    location: "Málaga",
    city: "Andalucia",
    country: "Spain",
  },
  {
    id: "fergus_lloret",
    name: "Lloret Vibe Affiliated by Fergus",
    location: "Girona",
    city: "Cataluñna",
    country: "Spain",
  },
];

export function getHotelGroups(): HotelGroup[] {
  const grouped = MOCK_HOTELS.reduce((acc, hotel) => {
    if (hotel.id === "all-hotels") return acc;

    const location = hotel.location;
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(hotel);
    return acc;
  }, {} as Record<string, Hotel[]>);

  return Object.entries(grouped).map(([location, hotels]) => ({
    location,
    hotels,
  }));
}

export function getHotelById(id: string): Hotel | undefined {
  // Use English version for consistency with tests
  return MOCK_HOTELS.find((hotel) => hotel.id === id);
}
