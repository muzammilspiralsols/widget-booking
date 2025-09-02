# API Reference

Complete API documentation for the Hotel Booking Widget.

## Table of Contents

1. [Widget Class](#widget-class)
2. [Configuration](#configuration)
3. [Events](#events)
4. [Methods](#methods)
5. [Utilities](#utilities)
6. [Types](#types)
7. [Examples](#examples)

## Widget Class

### WidgetSearch

Main widget class for creating and managing booking widgets.

```typescript
class WidgetSearch {
  constructor(container: HTMLElement, config: WidgetConfig);

  // Public methods
  public openModal(): void;
  public closeModal(): void;
  public updateConfig(newConfig: Partial<WidgetConfig>): void;
}
```

#### Constructor

```typescript
new WidgetSearch(container: HTMLElement, config: WidgetConfig)
```

**Parameters:**

- `container` - HTML element where the widget will be rendered
- `config` - Widget configuration object

**Example:**

```javascript
const container = document.getElementById("widget-search");
const config = {
  bookId: "hotel-123",
  type: "hotel",
  theme: "light",
};

const widget = new WidgetSearch(container, config);
```

### Global Functions

#### initializeWidgets()

Automatically initializes all widgets found on the page.

```typescript
function initializeWidgets(): void;
```

**Example:**

```javascript
// Initialize all widgets with data attributes
window.initializeWidgetSearch();
```

## Configuration

### WidgetConfig Interface

Complete configuration options for the widget.

```typescript
interface WidgetConfig {
  // Required
  bookId: string;

  // Widget Type
  type: "hotel" | "chain";
  hotel?: string;

  // Appearance
  layout: "inline" | "column" | "expand";
  theme: "light" | "dark";

  // Localization
  currency?: string;
  locale?: string;
  dateFormat: string;

  // Occupancy Defaults
  defaultAdults: number;
  defaultChildren: number;
  defaultRooms: number;

  // Occupancy Limits
  maxAdults: number;
  maxChildren: number;
  maxRooms: number;
  minChildAge: number;
  maxChildAge: number;

  // Date Constraints
  minDate?: Date;
  maxDate?: Date;

  // URLs
  baseUrl: string;
  apiUrl?: string;

  // Features
  showPromoCode: boolean;
  showHotelSelector: boolean;
}
```

### Configuration Details

#### Required Properties

| Property | Type     | Description                          |
| -------- | -------- | ------------------------------------ |
| `bookId` | `string` | Unique identifier for hotel or chain |

#### Widget Type

| Property | Type                   | Default     | Description                         |
| -------- | ---------------------- | ----------- | ----------------------------------- |
| `type`   | `"hotel"` \| `"chain"` | `"hotel"`   | Widget type                         |
| `hotel`  | `string`               | `undefined` | Specific hotel ID for chain widgets |

#### Appearance

| Property | Type                                   | Default    | Description         |
| -------- | -------------------------------------- | ---------- | ------------------- |
| `layout` | `"inline"` \| `"column"` \| `"expand"` | `"inline"` | Widget layout style |
| `theme`  | `"light"` \| `"dark"`                  | `"light"`  | Color theme         |

#### Localization

| Property     | Type     | Default         | Description              |
| ------------ | -------- | --------------- | ------------------------ |
| `currency`   | `string` | `undefined`     | Currency code (ISO 4217) |
| `locale`     | `string` | Browser default | Language/locale code     |
| `dateFormat` | `string` | `"dd-MM-yyyy"`  | Date display format      |

#### Occupancy Configuration

| Property          | Type     | Default | Description                |
| ----------------- | -------- | ------- | -------------------------- |
| `defaultAdults`   | `number` | `2`     | Default number of adults   |
| `defaultChildren` | `number` | `0`     | Default number of children |
| `defaultRooms`    | `number` | `1`     | Default number of rooms    |
| `maxAdults`       | `number` | `4`     | Maximum adults per room    |
| `maxChildren`     | `number` | `4`     | Maximum children per room  |
| `maxRooms`        | `number` | `5`     | Maximum number of rooms    |
| `minChildAge`     | `number` | `0`     | Minimum child age          |
| `maxChildAge`     | `number` | `17`    | Maximum child age          |

#### Date Constraints

| Property  | Type   | Default     | Description              |
| --------- | ------ | ----------- | ------------------------ |
| `minDate` | `Date` | Today       | Earliest selectable date |
| `maxDate` | `Date` | `undefined` | Latest selectable date   |

#### URLs

| Property  | Type     | Default             | Description                   |
| --------- | -------- | ------------------- | ----------------------------- |
| `baseUrl` | `string` | Default booking URL | Booking redirect URL          |
| `apiUrl`  | `string` | `undefined`         | API endpoint for availability |

#### Features

| Property            | Type      | Default         | Description                  |
| ------------------- | --------- | --------------- | ---------------------------- |
| `showPromoCode`     | `boolean` | `true`          | Show promo code input field  |
| `showHotelSelector` | `boolean` | Auto-determined | Show hotel selector dropdown |

### Configuration Examples

#### Basic Hotel Widget

```javascript
const config = {
  bookId: "hotel-123",
  type: "hotel",
  layout: "inline",
  theme: "light",
};
```

#### Advanced Chain Widget

```javascript
const config = {
  bookId: "chain-456",
  type: "chain",
  hotel: "specific-hotel-id",
  layout: "column",
  theme: "dark",
  currency: "EUR",
  locale: "es-ES",
  defaultAdults: 3,
  maxAdults: 8,
  maxRooms: 3,
  minDate: new Date("2024-01-01"),
  maxDate: new Date("2024-12-31"),
  showPromoCode: false,
};
```

## Events

The widget emits custom events for integration with your application.

### Event Types

#### widgetInitialized

Fired when a widget instance is successfully initialized.

```typescript
interface WidgetInitializedEvent extends CustomEvent {
  detail: {
    widgetId: string;
    config: WidgetConfig;
    container: HTMLElement;
  };
}
```

**Example:**

```javascript
document.addEventListener("widgetInitialized", (event) => {
  console.log("Widget initialized:", event.detail.widgetId);
  console.log("Configuration:", event.detail.config);
});
```

#### widgetSearchStarted

Fired when user initiates a search.

```typescript
interface WidgetSearchStartedEvent extends CustomEvent {
  detail: {
    widgetId: string;
    searchData: {
      hotel?: string;
      checkIn: Date;
      checkOut: Date;
      rooms: RoomConfig[];
      promoCode?: string;
    };
  };
}
```

**Example:**

```javascript
document.addEventListener("widgetSearchStarted", (event) => {
  const { searchData } = event.detail;
  console.log("Search started for:", searchData.hotel);
  console.log("Dates:", searchData.checkIn, "to", searchData.checkOut);

  // Track analytics
  gtag("event", "widget_search_started", {
    hotel_id: searchData.hotel,
    check_in: searchData.checkIn.toISOString(),
    check_out: searchData.checkOut.toISOString(),
  });
});
```

#### widgetDateSelected

Fired when user selects dates in the calendar.

```typescript
interface WidgetDateSelectedEvent extends CustomEvent {
  detail: {
    widgetId: string;
    checkIn?: Date;
    checkOut?: Date;
    nights?: number;
  };
}
```

**Example:**

```javascript
document.addEventListener("widgetDateSelected", (event) => {
  const { checkIn, checkOut, nights } = event.detail;
  console.log(`Selected ${nights} nights from ${checkIn} to ${checkOut}`);

  // Update pricing or availability
  updateRoomPricing(checkIn, checkOut);
});
```

#### widgetHotelSelected

Fired when user selects a hotel (chain widgets only).

```typescript
interface WidgetHotelSelectedEvent extends CustomEvent {
  detail: {
    widgetId: string;
    hotelId: string;
    hotelName: string;
  };
}
```

**Example:**

```javascript
document.addEventListener("widgetHotelSelected", (event) => {
  const { hotelId, hotelName } = event.detail;
  console.log("Hotel selected:", hotelName);

  // Update available room types or pricing
  loadHotelSpecificData(hotelId);
});
```

#### widgetOccupancyChanged

Fired when user changes room occupancy.

```typescript
interface WidgetOccupancyChangedEvent extends CustomEvent {
  detail: {
    widgetId: string;
    rooms: RoomConfig[];
    totalGuests: number;
  };
}
```

**Example:**

```javascript
document.addEventListener("widgetOccupancyChanged", (event) => {
  const { rooms, totalGuests } = event.detail;
  console.log(`${totalGuests} guests in ${rooms.length} rooms`);

  // Update availability based on occupancy
  checkRoomAvailability(rooms);
});
```

#### widgetRedirect

Fired before redirecting to booking page. Can be prevented.

```typescript
interface WidgetRedirectEvent extends CustomEvent {
  detail: {
    widgetId: string;
    url: string;
    searchData: SearchData;
  };
}
```

**Example:**

```javascript
document.addEventListener("widgetRedirect", (event) => {
  const { url, searchData } = event.detail;

  // Custom redirect handling
  event.preventDefault();

  // Add tracking parameters
  const trackingUrl = url + "&utm_source=widget&utm_campaign=booking";

  // Track conversion
  gtag("event", "widget_redirect", {
    destination_url: trackingUrl,
  });

  // Custom redirect
  window.open(trackingUrl, "_blank");
});
```

#### widgetError

Fired when an error occurs in the widget.

```typescript
interface WidgetErrorEvent extends CustomEvent {
  detail: {
    widgetId: string;
    error: Error;
    context: string;
  };
}
```

**Example:**

```javascript
document.addEventListener("widgetError", (event) => {
  const { error, context } = event.detail;
  console.error("Widget error:", error.message, "Context:", context);

  // Report error to monitoring service
  errorTracking.report(error, { context, component: "booking-widget" });
});
```

## Methods

### Instance Methods

#### openModal()

Opens the widget in a modal overlay (useful for mobile).

```typescript
openModal(): void
```

**Example:**

```javascript
const widget = new WidgetSearch(container, config);

// Open in modal for mobile users
if (window.innerWidth < 768) {
  widget.openModal();
}
```

#### closeModal()

Closes the modal overlay if open.

```typescript
closeModal(): void
```

**Example:**

```javascript
// Close modal programmatically
widget.closeModal();

// Close modal on custom event
document.addEventListener("closeWidget", () => {
  widget.closeModal();
});
```

#### updateConfig()

Updates widget configuration and re-renders.

```typescript
updateConfig(newConfig: Partial<WidgetConfig>): void
```

**Parameters:**

- `newConfig` - Partial configuration object with properties to update

**Example:**

```javascript
// Update theme
widget.updateConfig({ theme: "dark" });

// Update multiple properties
widget.updateConfig({
  currency: "EUR",
  locale: "es-ES",
  defaultAdults: 3,
});

// Update based on user preferences
const userPrefs = getUserPreferences();
widget.updateConfig({
  theme: userPrefs.darkMode ? "dark" : "light",
  currency: userPrefs.currency,
  locale: userPrefs.language,
});
```

### Static Methods

#### parseConfig()

Parses data attributes from a container element into a configuration object.

```typescript
static parseConfig(container: HTMLElement): WidgetConfig
```

**Example:**

```javascript
const container = document.getElementById("widget-search");
const config = WidgetSearch.parseConfig(container);
console.log("Parsed config:", config);
```

## Utilities

### Formatting Functions

#### formatPrice()

Formats price with currency symbol.

```typescript
function formatPrice(amount: number, currency?: string): string;
```

**Example:**

```javascript
import { formatPrice } from "hotel-booking-widget";

console.log(formatPrice(120)); // "$120"
console.log(formatPrice(120, "EUR")); // "€120"
console.log(formatPrice(120, "GBP")); // "£120"
```

#### formatDate()

Formats date according to specified format.

```typescript
function formatDate(date: Date, format?: string): string;
```

**Example:**

```javascript
import { formatDate } from "hotel-booking-widget";

const date = new Date("2024-01-15");
console.log(formatDate(date)); // "15-01-2024"
console.log(formatDate(date, "yyyy-MM-dd")); // "2024-01-15"
console.log(formatDate(date, "MM/dd/yyyy")); // "01/15/2024"
```

### Validation Functions

#### isValidDateRange()

Validates that check-out date is after check-in date.

```typescript
function isValidDateRange(checkIn: Date, checkOut: Date): boolean;
```

**Example:**

```javascript
import { isValidDateRange } from "hotel-booking-widget";

const checkIn = new Date("2024-01-15");
const checkOut = new Date("2024-01-20");

console.log(isValidDateRange(checkIn, checkOut)); // true
```

#### getDaysBetween()

Calculates number of days between two dates.

```typescript
function getDaysBetween(start: Date, end: Date): number;
```

**Example:**

```javascript
import { getDaysBetween } from "hotel-booking-widget";

const start = new Date("2024-01-15");
const end = new Date("2024-01-20");

console.log(getDaysBetween(start, end)); // 5
```

## Types

### Core Types

#### RoomConfig

Configuration for a single room's occupancy.

```typescript
interface RoomConfig {
  adults: number;
  children: number;
  childAges: number[];
}
```

#### SearchData

Complete search parameters for booking.

```typescript
interface SearchData {
  hotel?: string;
  checkIn: Date;
  checkOut: Date;
  rooms: RoomConfig[];
  promoCode?: string;
  currency?: string;
  locale?: string;
}
```

#### Hotel

Hotel information structure.

```typescript
interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
}
```

#### HotelGroup

Grouped hotels by location.

```typescript
interface HotelGroup {
  location: string;
  hotels: Hotel[];
}
```

### Enums

#### LayoutType

Available layout options.

```typescript
type LayoutType = "inline" | "column" | "expand";
```

#### ThemeType

Available theme options.

```typescript
type ThemeType = "light" | "dark";
```

#### WidgetType

Available widget types.

```typescript
type WidgetType = "hotel" | "chain";
```

## Examples

### Basic Implementation

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hotel Booking</title>
    <link rel="stylesheet" href="widget.css" />
  </head>
  <body>
    <div
      id="booking-widget"
      data-book-id="hotel-123"
      data-type="hotel"
      data-theme="light"
    ></div>

    <script src="widget-search.js"></script>
    <script>
      // Widget auto-initializes
      console.log("Widget loaded and initialized");
    </script>
  </body>
</html>
```

### Advanced Integration with Events

```javascript
// Configuration
const config = {
  bookId: "chain-456",
  type: "chain",
  theme: "light",
  currency: "USD",
  locale: "en-US",
};

// Create widget
const container = document.getElementById("advanced-widget");
const widget = new WidgetSearch(container, config);

// Event handlers
document.addEventListener("widgetDateSelected", (event) => {
  const { checkIn, checkOut, nights } = event.detail;

  // Update pricing display
  updatePricingDisplay(checkIn, checkOut, nights);

  // Check availability
  checkAvailability(checkIn, checkOut);
});

document.addEventListener("widgetHotelSelected", (event) => {
  const { hotelId, hotelName } = event.detail;

  // Update hotel-specific information
  loadHotelDetails(hotelId);

  // Update meta tags for SEO
  updateMetaTags(hotelName);
});

document.addEventListener("widgetRedirect", (event) => {
  const { url, searchData } = event.detail;

  // Add custom tracking
  const trackingUrl =
    url +
    "&utm_source=website" +
    "&utm_medium=widget" +
    "&utm_campaign=booking";

  // Track conversion
  analytics.track("Booking Started", {
    hotel: searchData.hotel,
    checkIn: searchData.checkIn,
    checkOut: searchData.checkOut,
    rooms: searchData.rooms.length,
  });

  // Custom redirect
  event.preventDefault();
  window.location.href = trackingUrl;
});

// Utility functions
function updatePricingDisplay(checkIn, checkOut, nights) {
  const priceDisplay = document.getElementById("price-display");
  if (priceDisplay) {
    priceDisplay.textContent = `${nights} nights selected`;

    // Fetch and display pricing
    fetchPricing(checkIn, checkOut).then((pricing) => {
      priceDisplay.textContent = `From $${pricing.minPrice} for ${nights} nights`;
    });
  }
}

function checkAvailability(checkIn, checkOut) {
  // Show loading indicator
  showLoadingIndicator();

  // Fetch availability
  fetch("/api/availability", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ checkIn, checkOut }),
  })
    .then((response) => response.json())
    .then((availability) => {
      updateAvailabilityDisplay(availability);
    })
    .finally(() => {
      hideLoadingIndicator();
    });
}
```

### React Hook Integration

```jsx
import { useEffect, useRef, useState } from "react";

function useBookingWidget(config) {
  const containerRef = useRef(null);
  const [widget, setWidget] = useState(null);
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    if (containerRef.current && window.WidgetSearch) {
      const widgetInstance = new window.WidgetSearch(
        containerRef.current,
        config
      );
      setWidget(widgetInstance);

      // Event listeners
      const handleSearchStarted = (event) => {
        setSearchData(event.detail.searchData);
      };

      document.addEventListener("widgetSearchStarted", handleSearchStarted);

      return () => {
        document.removeEventListener(
          "widgetSearchStarted",
          handleSearchStarted
        );
      };
    }
  }, [config]);

  const openModal = () => widget?.openModal();
  const closeModal = () => widget?.closeModal();
  const updateConfig = (newConfig) => widget?.updateConfig(newConfig);

  return {
    containerRef,
    widget,
    searchData,
    openModal,
    closeModal,
    updateConfig,
  };
}

// Component usage
function BookingPage({ hotelId }) {
  const config = {
    bookId: hotelId,
    type: "hotel",
    theme: "light",
  };

  const { containerRef, searchData, openModal } = useBookingWidget(config);

  return (
    <div>
      <h1>Book Your Stay</h1>
      <div ref={containerRef} />

      <button onClick={openModal}>Open Mobile Booking</button>

      {searchData && (
        <div>
          <h2>Search Summary</h2>
          <p>Check-in: {searchData.checkIn.toLocaleDateString()}</p>
          <p>Check-out: {searchData.checkOut.toLocaleDateString()}</p>
          <p>Rooms: {searchData.rooms.length}</p>
        </div>
      )}
    </div>
  );
}
```

### Vue.js Composition API

```vue
<template>
  <div>
    <div ref="widgetContainer"></div>
    <button @click="openModal">Open Mobile View</button>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";

const props = defineProps({
  hotelId: String,
  type: { type: String, default: "hotel" },
  theme: { type: String, default: "light" },
});

const widgetContainer = ref(null);
const widget = ref(null);
const searchData = reactive({
  hotel: null,
  checkIn: null,
  checkOut: null,
  rooms: [],
});

onMounted(() => {
  if (widgetContainer.value && window.WidgetSearch) {
    const config = {
      bookId: props.hotelId,
      type: props.type,
      theme: props.theme,
    };

    widget.value = new window.WidgetSearch(widgetContainer.value, config);

    // Listen for events
    document.addEventListener("widgetSearchStarted", (event) => {
      Object.assign(searchData, event.detail.searchData);
    });
  }
});

const openModal = () => {
  widget.value?.openModal();
};
</script>
```

## Error Handling

### Common Errors

#### Configuration Errors

```javascript
try {
  const widget = new WidgetSearch(container, config);
} catch (error) {
  if (error.message.includes("bookId")) {
    console.error("Missing required bookId configuration");
    // Show fallback booking link
    showFallbackBooking();
  }
}
```

#### Runtime Errors

```javascript
document.addEventListener("widgetError", (event) => {
  const { error, context } = event.detail;

  switch (context) {
    case "initialization":
      console.error("Widget failed to initialize:", error);
      showFallbackBooking();
      break;

    case "api":
      console.error("API error:", error);
      showErrorMessage("Unable to load pricing. Please try again.");
      break;

    case "validation":
      console.error("Validation error:", error);
      showValidationMessage(error.message);
      break;

    default:
      console.error("Unknown widget error:", error);
      showGenericError();
  }
});
```

## Performance Optimization

### Lazy Loading

```javascript
// Load widget only when needed
function loadBookingWidget() {
  if (!window.WidgetSearch) {
    const script = document.createElement("script");
    script.src = "widget-search.js";
    script.onload = () => initializeWidget();
    document.head.appendChild(script);
  } else {
    initializeWidget();
  }
}

// Initialize on user interaction
document
  .getElementById("book-now-btn")
  .addEventListener("click", loadBookingWidget);
```

### Preloading

```html
<!-- Preload for faster loading -->
<link rel="preload" href="widget.css" as="style" />
<link rel="preload" href="widget-search.js" as="script" />
```

### Code Splitting

```javascript
// Dynamic import for modern browsers
async function loadWidget() {
  const { WidgetSearch } = await import("./widget-search.js");
  return WidgetSearch;
}
```

This completes the comprehensive API documentation for the Hotel Booking Widget.
