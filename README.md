# Hotel Booking Widget

A fully responsive, accessible hotel booking search widget built with TypeScript and vanilla JavaScript.

## Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Accessibility**: WCAG 2.1 AA compliant
- **No Dependencies**: Pure vanilla JavaScript
- **TypeScript**: Fully typed codebase
- **Customizable**: Parameterized CSS variables
- **API Integration**: Optional availability checking
- **Event System**: External control via updateData/updateParams events

## Quick Start

### Basic Integration

```html
<link rel="stylesheet" href="https://cdn.miwidget.com/widget.css">
<script type="module" src="https://cdn.miwidget.com/widget.js"></script>
<div id="widget-search" data-hotel-id="12345"></div>
```

### Advanced Configuration

```html
<div id="widget-search" 
     data-hotel-id="12345"
     data-type="chain"
     data-layout="inline"
     data-theme="light"
     data-show-promo-code="true"
     data-show-hotel-selector="true"
     data-external-url="https://www.miweb.com/buscar"
     data-api-url="https://api.example.com">
</div>
```

## Configuration Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-hotel-id` | string | - | **Required.** Hotel identifier |
| `data-type` | "hotel" \| "chain" | "hotel" | Widget type |
| `data-layout` | "inline" \| "column" \| "expand" | "inline" | Layout style |
| `data-theme` | "light" \| "dark" | "light" | Color theme |
| `data-locale` | string | "en" | Language locale |
| `data-currency` | string | - | Currency code |
| `data-show-promo-code` | boolean | true | Show promotional code input |
| `data-show-hotel-selector` | boolean | false | Show hotel selector (chain only) |
| `data-show-price` | boolean | true | Show prices in calendar |
| `data-external-url` | string | - | Custom redirect URL |
| `data-api-url` | string | - | API endpoint for availability |
| `data-min-date` | string | today | Minimum selectable date (YYYY-MM-DD) |
| `data-max-date` | string | +1 year | Maximum selectable date (YYYY-MM-DD) |
| `data-default-adults` | number | 2 | Default number of adults |
| `data-default-children` | number | 0 | Default number of children |
| `data-default-rooms` | number | 1 | Default number of rooms |
| `data-max-adults` | number | 4 | Maximum adults per room |
| `data-max-children` | number | 4 | Maximum children per room |
| `data-max-rooms` | number | 5 | Maximum number of rooms |
| `data-min-child-age` | number | 0 | Minimum child age |
| `data-max-child-age` | number | 17 | Maximum child age |

## Events

### updateData

Update widget data programmatically:

```javascript
const widget = window.getWidgetInstance('widget-search');
widget.updateData({
  idHotel: 'hotel-123',
  promoCode: 'SUMMER2024',
  openCalendar: true,
  checkIn: '15-08-2024',
  checkOut: '20-08-2024',
  minDate: '01-08-2024',
  maxDate: '31-12-2024'
});
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `idHotel` | string | Hotel identifier to select |
| `promoCode` | string | Promotional code to set |
| `openCalendar` | boolean | Open calendar popup |
| `checkIn` | string | Check-in date (DD-MM-YYYY) |
| `checkOut` | string | Check-out date (DD-MM-YYYY) |
| `minDate` | string | Minimum selectable date (DD-MM-YYYY) |
| `maxDate` | string | Maximum selectable date (DD-MM-YYYY) |

### updateParams

Add custom parameters to the redirect URL:

```javascript
const widget = window.getWidgetInstance('widget-search');
widget.updateParams({
  'il_like': 'DBL',
  'source': 'widget',
  'campaign': 'summer2024'
});
```

## API Integration

### Availability Check

The widget can optionally check availability before redirecting:

```html
<div id="widget-search" 
     data-api-url="https://api.example.com"
     data-hotel-id="12345">
</div>
```

**API Endpoint**: `GET /api/disponibilidad`

**Parameters**:
- `hotel_id`: Hotel identifier
- `fecha_inicio`: Check-in date (YYYY-MM-DD)
- `fecha_fin`: Check-out date (YYYY-MM-DD)

**Response**:
```json
{
  "available": true,
  "message": "Rooms available"
}
```

## URL Redirection

The widget redirects to the configured URL with the following parameters:

```
https://www.miweb.com/buscar?hotel=12345&entry=2024-08-10&exit=2024-08-12&adults=2&promo=XYZ
```

### Parameters

| Parameter | Description |
|-----------|-------------|
| `hotel` | Selected hotel ID |
| `entry` | Check-in date (YYYY-MM-DD) |
| `exit` | Check-out date (YYYY-MM-DD) |
| `adults` | Total number of adults |
| `promo` | Promotional code (if provided) |

## Customization

### CSS Variables

The widget uses parameterized CSS variables for easy theming:

```css
:root {
  --primary-color: #e74c3c;
  --text-color: #2c3e50;
  --background: #ecf0f1;
  --border-color: #bdc3c7;
  --text-size: 14px;
  --font-family: "Helvetica Neue", Arial, sans-serif;
}
```

### Themes

#### Light Theme (Default)
```html
<div id="widget-search" data-theme="light"></div>
```

#### Dark Theme
```html
<div id="widget-search" data-theme="dark"></div>
```

## Browser Support

- **Chrome**: 60+
- **Safari**: 12+
- **Firefox**: 55+
- **Edge**: 79+

## Mobile/Tablet Behavior

- **Desktop (>1024px)**: Full horizontal layout
- **Mobile/Tablet (<1024px)**: Search button that opens modal

## Accessibility

- **WCAG 2.1 AA** compliant
- **Keyboard navigation** support
- **Screen reader** compatible
- **High contrast** mode support
- **Focus management** for modals and dropdowns

## Development

### Build

```bash
npm install
npm run build
```

### Development Server

```bash
npm run dev
```

### Tests

```bash
npm test
```

## File Structure

```
src/
├── index.ts         # Entry point
├── types/
│   └── config.ts    # Configuration parsing
├── components/
│   ├── render.ts    # HTML rendering
│   └── events.ts    # Event handling
├── utils/
│   └── utils.ts     # Helper functions
└── styles/
    └── widget.scss  # Styles with CSS variables
```

## License

MIT License - see LICENSE file for details.