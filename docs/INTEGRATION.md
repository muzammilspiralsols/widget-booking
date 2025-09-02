# HTML Integration Manual

This guide provides comprehensive instructions for integrating the Hotel Booking Widget into any website.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Installation Methods](#installation-methods)
3. [Basic Configuration](#basic-configuration)
4. [Advanced Configuration](#advanced-configuration)
5. [Customization](#customization)
6. [Framework Integration](#framework-integration)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

## Quick Start

### Step 1: Include Widget Files

Add the CSS and JavaScript files to your HTML document:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Website</title>

    <!-- Widget CSS -->
    <link rel="stylesheet" href="path/to/widget.css" />
  </head>
  <body>
    <!-- Your content -->

    <!-- Widget JavaScript -->
    <script src="path/to/widget-search.js"></script>
  </body>
</html>
```

### Step 2: Add Widget Container

Insert the widget container where you want the booking form to appear:

```html
<div id="widget-search" data-book-id="your-hotel-id" data-type="hotel"></div>
```

### Step 3: Initialize (Optional)

The widget auto-initializes, but you can manually control initialization:

```html
<script>
  // Widget initializes automatically on page load
  // Optional: Manual initialization
  window.initializeWidgetSearch();
</script>
```

## Installation Methods

### Method 1: CDN (Recommended for Production)

```html
<!-- CSS -->
<link rel="stylesheet" href="https://your-cdn.com/widget.css" />

<!-- JavaScript -->
<script src="https://your-cdn.com/widget-search.js"></script>
```

### Method 2: Self-Hosted Files

1. Download the widget files:

   - `widget-search.js`
   - `widget.css`

2. Upload to your server and reference them:

```html
<link rel="stylesheet" href="/assets/css/widget.css" />
<script src="/assets/js/widget-search.js"></script>
```

### Method 3: NPM Package (For Build Systems)

```bash
npm install hotel-booking-widget
```

```javascript
import "hotel-booking-widget/dist/widget.css";
import { WidgetSearch } from "hotel-booking-widget";

const container = document.getElementById("widget-search");
const config = {
  bookId: "your-hotel-id",
  type: "hotel",
};

new WidgetSearch(container, config);
```

## Basic Configuration

### Minimum Required Setup

```html
<div id="widget-search" data-book-id="12345" data-type="hotel"></div>
```

### Common Configurations

#### Hotel Widget

```html
<div
  id="hotel-booking-widget"
  data-book-id="hotel-123"
  data-type="hotel"
  data-layout="inline"
  data-theme="light"
></div>
```

#### Chain Widget

```html
<div
  id="chain-booking-widget"
  data-book-id="chain-456"
  data-type="chain"
  data-layout="column"
  data-currency="EUR"
  data-locale="es-ES"
></div>
```

#### Mobile-Optimized Widget

```html
<div
  id="mobile-widget"
  data-book-id="hotel-789"
  data-type="hotel"
  data-layout="column"
  data-theme="light"
></div>
```

## Advanced Configuration

### All Available Options

```html
<div
  id="advanced-widget"
  data-book-id="hotel-123"
  data-type="chain"
  data-hotel="specific-hotel-id"
  data-layout="expand"
  data-theme="dark"
  data-currency="USD"
  data-locale="en-US"
  data-base-url="https://your-booking-site.com/"
  data-api-url="https://api.your-site.com/"
  data-default-adults="2"
  data-default-children="1"
  data-default-rooms="1"
  data-max-adults="8"
  data-max-children="4"
  data-max-rooms="5"
  data-min-child-age="0"
  data-max-child-age="17"
  data-min-date="2024-01-01"
  data-max-date="2024-12-31"
  data-show-promo-code="true"
  data-date-format="yyyy-MM-dd"
></div>
```

### Configuration Reference

| Attribute               | Description                           | Type                                   | Default             | Required |
| ----------------------- | ------------------------------------- | -------------------------------------- | ------------------- | -------- |
| `data-book-id`          | Unique hotel or chain identifier      | String                                 | -                   | ✅       |
| `data-type`             | Widget type                           | `"hotel"` \| `"chain"`                 | `"hotel"`           | -        |
| `data-hotel`            | Specific hotel ID (for chains)        | String                                 | -                   | -        |
| `data-layout`           | Layout style                          | `"inline"` \| `"column"` \| `"expand"` | `"inline"`          | -        |
| `data-theme`            | Color theme                           | `"light"` \| `"dark"`                  | `"light"`           | -        |
| `data-currency`         | Currency code (ISO 4217)              | String                                 | -                   | -        |
| `data-locale`           | Language/locale code                  | String                                 | Browser default     | -        |
| `data-base-url`         | Booking redirect URL                  | String                                 | Default booking URL | -        |
| `data-api-url`          | API endpoint for availability         | String                                 | -                   | -        |
| `data-default-adults`   | Default adult count                   | Number                                 | `2`                 | -        |
| `data-default-children` | Default children count                | Number                                 | `0`                 | -        |
| `data-default-rooms`    | Default room count                    | Number                                 | `1`                 | -        |
| `data-max-adults`       | Maximum adults per room               | Number                                 | `4`                 | -        |
| `data-max-children`     | Maximum children per room             | Number                                 | `4`                 | -        |
| `data-max-rooms`        | Maximum number of rooms               | Number                                 | `5`                 | -        |
| `data-min-child-age`    | Minimum child age                     | Number                                 | `0`                 | -        |
| `data-max-child-age`    | Maximum child age                     | Number                                 | `17`                | -        |
| `data-min-date`         | Earliest selectable date (YYYY-MM-DD) | String                                 | Today               | -        |
| `data-max-date`         | Latest selectable date (YYYY-MM-DD)   | String                                 | -                   | -        |
| `data-show-promo-code`  | Show promo code field                 | Boolean                                | `true`              | -        |
| `data-date-format`      | Date display format                   | String                                 | `"dd-MM-yyyy"`      | -        |

## Customization

### CSS Customization

Override default styles with CSS custom properties:

```css
.widget-search-container {
  --widget-primary-color: #your-brand-color;
  --widget-primary-hover: #your-hover-color;
  --widget-background: #ffffff;
  --widget-text-color: #333333;
  --widget-border-radius: 8px;
  --widget-font-family: "Your Font", sans-serif;
}
```

### Custom Styling Example

```css
/* Custom brand colors */
.my-booking-widget {
  --widget-primary-color: #e74c3c;
  --widget-primary-hover: #c0392b;
  --widget-border-radius: 12px;
}

/* Custom responsive behavior */
@media (max-width: 768px) {
  .my-booking-widget .widget-fields {
    flex-direction: column;
  }
}
```

### Theme Customization

```html
<!-- Custom theme wrapper -->
<div class="custom-theme">
  <div id="widget-search" data-book-id="hotel-123" data-type="hotel"></div>
</div>
```

```css
.custom-theme .widget-search-container {
  --widget-primary-color: #2ecc71;
  --widget-background: #f8f9fa;
  border: 2px solid #2ecc71;
  border-radius: 16px;
}
```

## Framework Integration

### React Integration

```jsx
import React, { useEffect, useRef } from "react";
import "hotel-booking-widget/dist/widget.css";

const BookingWidget = ({ hotelId, type = "hotel", theme = "light" }) => {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (widgetRef.current && window.WidgetSearch) {
      const config = {
        bookId: hotelId,
        type: type,
        theme: theme,
      };

      new window.WidgetSearch(widgetRef.current, config);
    }
  }, [hotelId, type, theme]);

  return (
    <div
      ref={widgetRef}
      data-book-id={hotelId}
      data-type={type}
      data-theme={theme}
    />
  );
};

export default BookingWidget;
```

### Vue.js Integration

```vue
<template>
  <div
    ref="widgetContainer"
    :data-book-id="hotelId"
    :data-type="type"
    :data-theme="theme"
  ></div>
</template>

<script>
import "hotel-booking-widget/dist/widget.css";

export default {
  name: "BookingWidget",
  props: {
    hotelId: { type: String, required: true },
    type: { type: String, default: "hotel" },
    theme: { type: String, default: "light" },
  },
  mounted() {
    if (window.WidgetSearch) {
      const config = {
        bookId: this.hotelId,
        type: this.type,
        theme: this.theme,
      };

      new window.WidgetSearch(this.$refs.widgetContainer, config);
    }
  },
};
</script>
```

### Angular Integration

```typescript
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";

declare global {
  interface Window {
    WidgetSearch: any;
  }
}

@Component({
  selector: "app-booking-widget",
  template: `
    <div
      #widgetContainer
      [attr.data-book-id]="hotelId"
      [attr.data-type]="type"
      [attr.data-theme]="theme"
    ></div>
  `,
})
export class BookingWidgetComponent implements OnInit {
  @Input() hotelId: string = "";
  @Input() type: string = "hotel";
  @Input() theme: string = "light";

  @ViewChild("widgetContainer", { static: true })
  widgetContainer!: ElementRef;

  ngOnInit() {
    if (window.WidgetSearch) {
      const config = {
        bookId: this.hotelId,
        type: this.type,
        theme: this.theme,
      };

      new window.WidgetSearch(this.widgetContainer.nativeElement, config);
    }
  }
}
```

### WordPress Integration

#### Method 1: Plugin Installation

1. Upload widget files to `/wp-content/plugins/booking-widget/`
2. Add to `functions.php`:

```php
function enqueue_booking_widget() {
    wp_enqueue_style('booking-widget',
        plugin_dir_url(__FILE__) . 'booking-widget/widget.css');
    wp_enqueue_script('booking-widget',
        plugin_dir_url(__FILE__) . 'booking-widget/widget-search.js',
        [], '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'enqueue_booking_widget');
```

#### Method 2: Shortcode Implementation

```php
function booking_widget_shortcode($atts) {
    $atts = shortcode_atts([
        'hotel_id' => '',
        'type' => 'hotel',
        'theme' => 'light',
        'layout' => 'inline'
    ], $atts);

    return '<div id="widget-search-' . uniqid() . '"
                 data-book-id="' . esc_attr($atts['hotel_id']) . '"
                 data-type="' . esc_attr($atts['type']) . '"
                 data-theme="' . esc_attr($atts['theme']) . '"
                 data-layout="' . esc_attr($atts['layout']) . '">
            </div>';
}
add_shortcode('booking_widget', 'booking_widget_shortcode');
```

Usage in posts: `[booking_widget hotel_id="123" type="hotel" theme="light"]`

## Multiple Widgets

### Multiple Widgets on Same Page

```html
<!-- Hotel Widget -->
<div id="widget-search-1" data-book-id="hotel-123" data-type="hotel"></div>

<!-- Chain Widget -->
<div id="widget-search-2" data-book-id="chain-456" data-type="chain"></div>

<!-- Different Theme -->
<div
  id="widget-search-3"
  data-book-id="hotel-789"
  data-type="hotel"
  data-theme="dark"
></div>
```

### Dynamic Widget Creation

```javascript
function createBookingWidget(containerId, config) {
  const container = document.getElementById(containerId);
  if (container && window.WidgetSearch) {
    new window.WidgetSearch(container, config);
  }
}

// Create widgets dynamically
createBookingWidget("dynamic-widget-1", {
  bookId: "hotel-123",
  type: "hotel",
  theme: "light",
});

createBookingWidget("dynamic-widget-2", {
  bookId: "chain-456",
  type: "chain",
  layout: "column",
});
```

## Event Handling

### Custom Event Listeners

```javascript
// Listen for widget events
document.addEventListener("widgetSearchStarted", function (event) {
  console.log("Search started:", event.detail);
  // Track analytics, show loading, etc.
});

document.addEventListener("widgetDateSelected", function (event) {
  console.log("Dates selected:", event.detail);
  // Update availability, pricing, etc.
});

document.addEventListener("widgetRedirect", function (event) {
  console.log("Redirecting to:", event.detail.url);
  // Custom redirect handling
  event.preventDefault(); // Prevent default redirect
  window.location.href = event.detail.url + "&utm_source=widget";
});
```

### Widget API

```javascript
// Get widget instance
const widgetContainer = document.getElementById("widget-search");
const widget = widgetContainer.widgetInstance;

// Update configuration
if (widget) {
  widget.updateConfig({
    theme: "dark",
    currency: "EUR",
  });

  // Open in modal (mobile-friendly)
  widget.openModal();

  // Close modal
  widget.closeModal();
}
```

## Troubleshooting

### Common Issues

#### Widget Not Displaying

**Problem**: Widget container is empty
**Solutions**:

1. Check JavaScript console for errors
2. Verify widget files are loaded correctly
3. Ensure `data-book-id` is provided
4. Check container has valid ID

```javascript
// Debug widget initialization
console.log("Widget Search available:", typeof window.WidgetSearch);
console.log(
  "Widget containers:",
  document.querySelectorAll('[id^="widget-search"]')
);
```

#### Styling Issues

**Problem**: Widget doesn't match site design
**Solutions**:

1. Override CSS custom properties
2. Check for CSS conflicts
3. Use specific selectors
4. Verify CSS file is loaded after other stylesheets

```css
/* Force widget styles */
.widget-search-container {
  all: initial;
  font-family: inherit;
}
```

#### Mobile Responsiveness

**Problem**: Widget not responsive on mobile
**Solutions**:

1. Set `data-layout="column"` for mobile
2. Add viewport meta tag
3. Test responsive breakpoints

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

#### JavaScript Errors

**Problem**: Console shows widget errors
**Solutions**:

1. Check JavaScript file integrity
2. Ensure no conflicting libraries
3. Verify DOM is ready before initialization

```javascript
// Safe initialization
document.addEventListener("DOMContentLoaded", function () {
  if (window.WidgetSearch) {
    window.initializeWidgetSearch();
  } else {
    console.error("Widget Search not loaded");
  }
});
```

### Performance Issues

#### Large Bundle Size

**Solutions**:

1. Use minified version (`widget-search.min.js`)
2. Load asynchronously for non-critical widgets
3. Use defer attribute for scripts

```html
<script src="widget-search.min.js" defer></script>
```

#### Slow Initial Load

**Solutions**:

1. Preload critical resources
2. Use CDN for better caching
3. Optimize images and assets

```html
<link rel="preload" href="widget.css" as="style" />
<link rel="preload" href="widget-search.js" as="script" />
```

### Browser Compatibility

#### Internet Explorer Support

For IE11 support, include polyfills:

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script src="widget-search.js"></script>
```

#### Safari Issues

For Safari-specific issues:

```css
/* Safari-specific fixes */
@supports (-webkit-appearance: none) {
  .widget-search-container .field-trigger {
    -webkit-appearance: none;
  }
}
```

## Best Practices

### Performance

1. **Load widget files efficiently**:

   ```html
   <link
     rel="preload"
     href="widget.css"
     as="style"
     onload="this.onload=null;this.rel='stylesheet'"
   />
   <script src="widget-search.js" defer></script>
   ```

2. **Use appropriate layout for screen size**:

   ```javascript
   const isMobile = window.innerWidth < 768;
   const layout = isMobile ? "column" : "inline";
   ```

3. **Optimize for Core Web Vitals**:
   - Use `loading="lazy"` for non-critical widgets
   - Minimize layout shifts with fixed dimensions
   - Preload critical resources

### Accessibility

1. **Ensure proper focus management**:

   ```css
   .widget-search-container *:focus {
     outline: 2px solid #005fcc;
     outline-offset: 2px;
   }
   ```

2. **Provide alternative navigation**:

   ```html
   <a href="/booking" class="sr-only skip-link">Skip to booking page</a>
   ```

3. **Test with screen readers**:
   - NVDA (Windows)
   - VoiceOver (macOS)
   - TalkBack (Android)

### SEO

1. **Include fallback content**:

   ```html
   <div id="widget-search" data-book-id="hotel-123">
     <noscript>
       <p>Book directly at <a href="/booking">our booking page</a></p>
     </noscript>
   </div>
   ```

2. **Use structured data**:
   ```html
   <script type="application/ld+json">
     {
       "@context": "https://schema.org",
       "@type": "LodgingBusiness",
       "name": "Your Hotel Name"
     }
   </script>
   ```

### Security

1. **Validate configuration data**:

   ```javascript
   function sanitizeConfig(config) {
     return {
       bookId: String(config.bookId).replace(/[^a-zA-Z0-9-]/g, ""),
       type: ["hotel", "chain"].includes(config.type) ? config.type : "hotel",
     };
   }
   ```

2. **Use Content Security Policy**:
   ```html
   <meta
     http-equiv="Content-Security-Policy"
     content="script-src 'self' 'unsafe-inline' your-cdn.com;"
   />
   ```

### Testing

1. **Test across devices and browsers**
2. **Verify accessibility compliance**
3. **Test with slow network connections**
4. **Validate configuration options**

```javascript
// Testing helper
function testWidget(containerId) {
  const container = document.getElementById(containerId);
  const tests = {
    containerExists: !!container,
    hasRequiredData: container?.hasAttribute("data-book-id"),
    widgetInitialized: container?.hasAttribute("data-widget-initialized"),
    hasContent: container?.children.length > 0,
  };

  console.table(tests);
  return Object.values(tests).every(Boolean);
}
```

## Support

For additional support and documentation:

- **Technical Documentation**: [README.md](../README.md)
- **API Reference**: [API.md](./API.md)
- **Accessibility Guide**: [ACCESSIBILITY.md](./ACCESSIBILITY.md)
- **Examples**: See `/examples` folder

## Updates

Keep your widget updated for security and feature improvements:

1. **Check for updates regularly**
2. **Test in staging environment**
3. **Review changelog for breaking changes**
4. **Update integration code if needed**

### Version Migration

When updating major versions, review the migration guide and test thoroughly in a staging environment before deploying to production.
