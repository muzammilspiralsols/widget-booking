# CSS Variables - Parameterized Approach

## Overview

The widget now uses a parameterized CSS variable approach as specified in the technical requirements. This allows for easy customization through CSS custom properties.

## Variable Naming Convention

### Color Variables
```css
--widget-cl-primary: var(--primary-color, #776f66);
--widget-cl-primary-hover: var(--primary-hover, #5b4f4b);
--widget-cl-text: var(--text-color, #000000);
--widget-cl-text-gray: var(--text-gray, #666666);
--widget-cl-border: var(--border-color, #dadada);
--widget-cl-background: var(--background, #ffffff);
--widget-cl-hover-bg: var(--hover-bg, #f6f6f6);
```

### Typography Variables
```css
--widget-fs-text: var(--text-size, 12px);
--widget-ff-text: var(--font-family, "Roboto", sans-serif);
```

### Layout Variables
```css
--widget-br-radius: var(--border-radius, 4px);
--widget-sh-shadow: var(--shadow, 0 2px 8px rgba(0, 0, 0, 0.15));
```

### Accessibility Variables
```css
--widget-cl-focus: var(--focus-color, #005fcc);
--widget-sh-focus: var(--focus-shadow, 0 0 0 3px rgba(0, 95, 204, 0.3));
--widget-cl-error: var(--error-color, #dc3545);
--widget-cl-success: var(--success-color, #28a745);
--widget-cl-warning: var(--warning-color, #ffc107);
```

## Usage Examples

### Basic Customization
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

### Dark Theme
```css
.widget-search-container.dark {
  --widget-cl-background: #2a2a2a;
  --widget-cl-text: #ffffff;
  --widget-cl-text-gray: #cccccc;
  --widget-cl-border: #555555;
  --widget-cl-hover-bg: #3a3a3a;
  --widget-cl-primary: #d4af37;
  --widget-cl-primary-hover: #b8941f;
}
```

### Custom Brand Colors
```css
:root {
  --primary-color: #541351;
  --primary-hover: #30062e;
  --text-color: #000541351000;
  --text-gray: #666666;
  --border-color: #ddd;
  --background: #ffffff;
  --hover-bg: #f6f6f6;
  --border-radius: 20px;
  --text-size: 16px;
  --font-family: "Montserrat", sans-serif;
}
```

## Legacy Support

The widget maintains backward compatibility by mapping the new parameterized variables to the legacy variable names:

```css
/* Legacy support - map to new variables */
--widget-primary-color: var(--widget-cl-primary);
--widget-text-color: var(--widget-cl-text);
--widget-border-color: var(--widget-cl-border);
/* ... etc */
```

## Integration

The parameterized approach allows for easy theming by simply overriding the base CSS custom properties:

```html
<style>
:root {
  --primary-color: #your-brand-color;
  --text-color: #your-text-color;
  --background: #your-background-color;
}
</style>
<link rel="stylesheet" href="https://cdn.miwidget.com/widget.css">
<script type="module" src="https://cdn.miwidget.com/widget.js"></script>
<div id="widget-search" data-hotel-id="12345"></div>
```

This approach provides maximum flexibility while maintaining a clean, organized variable structure.
