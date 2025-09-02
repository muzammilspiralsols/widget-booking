export function formatDate(date: Date, format: string = "dd-MM-yyyy"): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const shortYear = year.toString().substr(-2); // Get last 2 digits of year

  switch (format) {
    case "yyyy-MM-dd":
      return `${year}-${month}-${day}`;
    case "dd-MM-yyyy":
      return `${day}-${month}-${year}`;
    case "MM/dd/yyyy":
      return `${month}/${day}/${year}`;
    case "compact": // New compact format
      return `${day}/${month}/${shortYear}`;
    default:
      return `${day}-${month}-${year}`;
  }
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isMobile(): boolean {
  return window.innerWidth < 1024;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
}

export function createElement(
  tag: string,
  className?: string,
  textContent?: string
): HTMLElement {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

export function getDaysBetween(start: Date, end: Date): number {
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

export function isValidDateRange(checkIn: Date, checkOut: Date): boolean {
  return checkOut > checkIn;
}

export function getMonthName(date: Date, locale: string = "en-US"): string {
  return date.toLocaleDateString(locale, { month: "long" });
}

export function getWeekdayNames(locale: string = "en-US"): string[] {
  const baseDate = new Date(2023, 0, 1); // Start from a Sunday
  const weekdays = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    weekdays.push(date.toLocaleDateString(locale, { weekday: "short" }));
  }

  return weekdays;
}

export function formatPrice(amount: number, currency?: string): string {
  if (!currency) {
    return `$${amount}`;
  }

  // Map of common currency codes to symbols
  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "C$",
    AUD: "A$",
    CHF: "CHF",
    CNY: "¥",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
    PLN: "zł",
    CZK: "Kč",
    HUF: "Ft",
    RUB: "₽",
    BRL: "R$",
    MXN: "$",
    KRW: "₩",
    SGD: "S$",
    NZD: "NZ$",
    ZAR: "R",
    INR: "₹",
    THB: "฿",
    TRY: "₺",
  };

  const symbol =
    currencySymbols[currency.toUpperCase()] || currency.toUpperCase();

  // For currencies that typically come after the amount
  const suffixCurrencies = ["SEK", "NOK", "DKK", "PLN", "CZK", "HUF"];

  if (suffixCurrencies.includes(currency.toUpperCase())) {
    return `${amount} ${symbol}`;
  }

  return `${symbol}${amount}`;
}

// Localization system
interface Translations {
  [key: string]: {
    [locale: string]: string;
  };
}

const translations: Translations = {
  // Field labels
  "field.where": {
    en: "Where",
    "en-US": "Where",
    "en-GB": "Where",
    es: "Dónde",
    "es-ES": "Dónde",
    "es-MX": "Dónde",
  },
  "field.when": {
    en: "When",
    "en-US": "When",
    "en-GB": "When",
    es: "Cuándo",
    "es-ES": "Cuándo",
    "es-MX": "Cuándo",
  },
  "field.who": {
    en: "Who",
    "en-US": "Who",
    "en-GB": "Who",
    es: "Quién",
    "es-ES": "Quién",
    "es-MX": "Quién",
  },
  // Hotel selector
  "hotel.select": {
    en: "Select Hotel",
    "en-US": "Select Hotel",
    "en-GB": "Select Hotel",
    es: "Seleccionar Hotel",
    "es-ES": "Seleccionar Hotel",
    "es-MX": "Seleccionar Hotel",
  },
  "hotel.search": {
    en: "Search hotels...",
    "en-US": "Search hotels...",
    "en-GB": "Search hotels...",
    es: "Buscar hoteles...",
    "es-ES": "Buscar hoteles...",
    "es-MX": "Buscar hoteles...",
  },
  "hotel.all": {
    en: "All Hotels",
    "en-US": "All Hotels",
    "en-GB": "All Hotels",
    es: "Todos los Hoteles",
    "es-ES": "Todos los Hoteles",
    "es-MX": "Todos los Hoteles",
  },
  // Date selector
  "date.checkin_checkout": {
    en: "Check-in — Check-out",
    "en-US": "Check-in — Check-out",
    "en-GB": "Check-in — Check-out",
    es: "Entrada — Salida",
    "es-ES": "Entrada — Salida",
    "es-MX": "Entrada — Salida",
  },
  "date.choose_checkout": {
    en: "Select checkout",
    "en-US": "Select checkout",
    "en-GB": "Select checkout",
    es: "Elegir salida",
    "es-ES": "Elegir salida",
    "es-MX": "Elegir salida",
  },
  // Calendar
  "calendar.select_checkin": {
    en: "Select your check-in date",
    "en-US": "Select your check-in date",
    "en-GB": "Select your check-in date",
    es: "Selecciona tu fecha de entrada",
    "es-ES": "Selecciona tu fecha de entrada",
    "es-MX": "Selecciona tu fecha de entrada",
  },
  "calendar.select_checkout": {
    en: "Now select your check-out date",
    "en-US": "Now select your check-out date",
    "en-GB": "Now select your check-out date",
    es: "Ahora selecciona tu fecha de salida",
    "es-ES": "Ahora selecciona tu fecha de salida",
    "es-MX": "Ahora selecciona tu fecha de salida",
  },
  "calendar.nights_selected": {
    en: "nights selected",
    "en-US": "nights selected",
    "en-GB": "nights selected",
    es: "noches seleccionadas",
    "es-ES": "noches seleccionadas",
    "es-MX": "noches seleccionadas",
  },
  "calendar.night_selected": {
    en: "night selected",
    "en-US": "night selected",
    "en-GB": "night selected",
    es: "noche seleccionada",
    "es-ES": "noche seleccionada",
    "es-MX": "noche seleccionada",
  },
  "calendar.quick_dates": {
    en: "Quick Select",
    "en-US": "Quick Select",
    "en-GB": "Quick Select",
    es: "Selección Rápida",
    "es-ES": "Selección Rápida",
    "es-MX": "Selección Rápida",
  },
  "calendar.today": {
    en: "Today",
    "en-US": "Today",
    "en-GB": "Today",
    es: "Hoy",
    "es-ES": "Hoy",
    "es-MX": "Hoy",
  },
  "calendar.tomorrow": {
    en: "Tomorrow",
    "en-US": "Tomorrow",
    "en-GB": "Tomorrow",
    es: "Mañana",
    "es-ES": "Mañana",
    "es-MX": "Mañana",
  },
  "calendar.next_week": {
    en: "Next Week",
    "en-US": "Next Week",
    "en-GB": "Next Week",
    es: "Próxima Semana",
    "es-ES": "Próxima Semana",
    "es-MX": "Próxima Semana",
  },
  "calendar.next_month": {
    en: "Next Month",
    "en-US": "Next Month",
    "en-GB": "Next Month",
    es: "Próximo Mes",
    "es-ES": "Próximo Mes",
    "es-MX": "Próximo Mes",
  },
  // Occupancy
  "occupancy.adults": {
    en: "Adults",
    "en-US": "Adults",
    "en-GB": "Adults",
    es: "Adultos",
    "es-ES": "Adultos",
    "es-MX": "Adultos",
  },
  "occupancy.children": {
    en: "Children",
    "en-US": "Children",
    "en-GB": "Children",
    es: "Niños",
    "es-ES": "Niños",
    "es-MX": "Niños",
  },
  "occupancy.adult": {
    en: "adult",
    "en-US": "adult",
    "en-GB": "adult",
    es: "adulto",
    "es-ES": "adulto",
    "es-MX": "adulto",
  },
  "occupancy.child": {
    en: "child",
    "en-US": "child",
    "en-GB": "child",
    es: "niño",
    "es-ES": "niño",
    "es-MX": "niño",
  },
  "occupancy.room": {
    en: "Room",
    "en-US": "Room",
    "en-GB": "Room",
    es: "Habitación",
    "es-ES": "Habitación",
    "es-MX": "Habitación",
  },
  "occupancy.rooms": {
    en: "rooms",
    "en-US": "rooms",
    "en-GB": "rooms",
    es: "habitaciones",
    "es-ES": "habitaciones",
    "es-MX": "habitaciones",
  },
  "occupancy.add_room": {
    en: "Add Room",
    "en-US": "Add Room",
    "en-GB": "Add Room",
    es: "Agregar Habitación",
    "es-ES": "Agregar Habitación",
    "es-MX": "Agregar Habitación",
  },
  "occupancy.remove": {
    en: "Remove",
    "en-US": "Remove",
    "en-GB": "Remove",
    es: "Eliminar",
    "es-ES": "Eliminar",
    "es-MX": "Eliminar",
  },
  "occupancy.age": {
    en: "age",
    "en-US": "age",
    "en-GB": "age",
    es: "edad",
    "es-ES": "edad",
    "es-MX": "edad",
  },
  "occupancy.years": {
    en: "age",
    "en-US": "age",
    "en-GB": "age",
    es: "año/s",
    "es-ES": "año/s",
    "es-MX": "año/s",
  },
  // Search
  "search.button": {
    en: "Search",
    "en-US": "Search",
    "en-GB": "Search",
    es: "Buscar",
    "es-ES": "Buscar",
    "es-MX": "Buscar",
  },
  "search.loading": {
    en: "Searching...",
    "en-US": "Searching...",
    "en-GB": "Searching...",
    es: "Buscando...",
    "es-ES": "Buscando...",
    "es-MX": "Buscando...",
  },
  "search.promo": {
    en: "Promo code",
    "en-US": "Promo code",
    "en-GB": "Promo code",
    es: "Código promocional",
    "es-ES": "Código promocional",
    "es-MX": "Código promocional",
  },
  // Other
  "button.done": {
    en: "Done",
    "en-US": "Done",
    "en-GB": "Done",
    es: "Listo",
    "es-ES": "Listo",
    "es-MX": "Listo",
  },
  // Alerts
  "alert.dates": {
    en: "Please select check-in and check-out dates",
    "en-US": "Please select check-in and check-out dates",
    "en-GB": "Please select check-in and check-out dates",
    es: "Por favor, selecciona las fechas de entrada y salida",
    "es-ES": "Por favor, selecciona las fechas de entrada y salida",
    "es-MX": "Por favor, selecciona las fechas de entrada y salida",
  },
  "alert.hotel": {
    en: "Please select a hotel",
    "en-US": "Please select a hotel",
    "en-GB": "Please select a hotel",
    es: "Por favor, selecciona hotel",
    "es-ES": "Por favor, selecciona hotel",
    "es-MX": "Por favor, selecciona hotel",
  },
  // Validation messages
  "validation.checkout_after_checkin": {
    en: "Check-out date must be after check-in date",
    "en-US": "Check-out date must be after check-in date",
    "en-GB": "Check-out date must be after check-in date",
    es: "La fecha de salida debe ser posterior a la fecha de entrada",
    "es-ES": "La fecha de salida debe ser posterior a la fecha de entrada",
    "es-MX": "La fecha de salida debe ser posterior a la fecha de entrada",
  },
  "validation.max_guests_exceeded": {
    en: "Maximum number of guests per room exceeded",
    "en-US": "Maximum number of guests per room exceeded",
    "en-GB": "Maximum number of guests per room exceeded",
    es: "Se ha excedido el número máximo de huéspedes por habitación",
    "es-ES": "Se ha excedido el número máximo de huéspedes por habitación",
    "es-MX": "Se ha excedido el número máximo de huéspedes por habitación",
  },
  // Check-in online
  "checkin.online": {
    en: "Check-in Online",
    "en-US": "Check-in Online",
    "en-GB": "Check-in Online",
    es: "Check-in Online",
    "es-ES": "Check-in Online",
    "es-MX": "Check-in Online",
  },
  // Modal
  "modal.close": {
    en: "Close modal",
    "en-US": "Close modal",
    "en-GB": "Close modal",
    es: "Cerrar modal",
    "es-ES": "Cerrar modal",
    "es-MX": "Cerrar modal",
  },
  // Hotel search
  "hotel.no_results": {
    en: "No results available",
    "en-US": "No results available",
    "en-GB": "No results available",
    es: "No hay resultados disponibles",
    "es-ES": "No hay resultados disponibles",
    "es-MX": "No hay resultados disponibles",
  },
  "hotel.all_hotels": {
    en: "All Hotels",
    "en-US": "All Hotels",
    "en-GB": "All Hotels",
    es: "Todos los hoteles",
    "es-ES": "Todos los hoteles",
    "es-MX": "Todos los hoteles",
  },
  // Calendar nights
  "calendar.night": {
    en: "night",
    "en-US": "night",
    "en-GB": "night",
    es: "noche",
    "es-ES": "noche",
    "es-MX": "noche",
  },
  "calendar.nights": {
    en: "nights",
    "en-US": "nights",
    "en-GB": "nights",
    es: "noches",
    "es-ES": "noches",
    "es-MX": "noches",
  },
  // Availability
  "availability.not_available": {
    en: "No availability for the selected dates",
    "en-US": "No availability for the selected dates",
    "en-GB": "No availability for the selected dates",
    es: "No hay disponibilidad para las fechas seleccionadas",
    "es-ES": "No hay disponibilidad para las fechas seleccionadas",
    "es-MX": "No hay disponibilidad para las fechas seleccionadas",
  },
  "availability.check_failed": {
    en: "Unable to check availability. Redirecting anyway...",
    "en-US": "Unable to check availability. Redirecting anyway...",
    "en-GB": "Unable to check availability. Redirecting anyway...",
    es: "No se pudo verificar la disponibilidad. Redirigiendo de todas formas...",
    "es-ES": "No se pudo verificar la disponibilidad. Redirigiendo de todas formas...",
    "es-MX": "No se pudo verificar la disponibilidad. Redirigiendo de todas formas...",
  },
};

export function t(key: string, locale: string = "en"): string {
  // Normalize locale (handle cases like "es-ES" -> "es")
  const normalizedLocale = locale.toLowerCase();
  const shortLocale = normalizedLocale.split("-")[0];

  const translation = translations[key];
  if (!translation) {
    console.warn(`Missing translation for key: ${key}`);
    return key;
  }

  // Try exact match first, then short locale, then fallback to English
  return (
    translation[normalizedLocale] ||
    translation[shortLocale] ||
    translation["en"] ||
    key
  );
}
