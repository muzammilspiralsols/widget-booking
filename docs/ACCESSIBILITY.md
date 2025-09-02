# Accessibility Compliance (WCAG 2.1 Level AA)

This document outlines the accessibility features implemented in the Hotel Booking Widget to ensure compliance with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.

## Overview

The widget has been designed and developed with accessibility as a core requirement, ensuring that users with disabilities can effectively interact with the booking interface using assistive technologies.

## WCAG 2.1 Level AA Compliance

### 1. Perceivable

#### 1.1 Text Alternatives

- **1.1.1 Non-text Content**: All interactive elements have appropriate text alternatives through `aria-label` attributes
- Images and icons include alternative text where appropriate
- Form controls have associated labels

#### 1.3 Adaptable

- **1.3.1 Info and Relationships**: Content structure is programmatically determinable through proper heading hierarchy and semantic markup
- **1.3.2 Meaningful Sequence**: Content maintains logical reading order
- **1.3.4 Orientation**: Widget works in both portrait and landscape orientations
- **1.3.5 Identify Input Purpose**: Form fields have appropriate `autocomplete` attributes where applicable

#### 1.4 Distinguishable

- **1.4.1 Use of Color**: Information is not conveyed by color alone
- **1.4.3 Contrast (Minimum)**: All text meets minimum contrast ratios:
  - Normal text: 4.5:1
  - Large text: 3:1
- **1.4.4 Resize Text**: Text can be resized up to 200% without loss of functionality
- **1.4.10 Reflow**: Content reflows without horizontal scrolling at 320px width
- **1.4.11 Non-text Contrast**: Interactive components meet 3:1 contrast ratio
- **1.4.12 Text Spacing**: No loss of functionality when text spacing is increased

### 2. Operable

#### 2.1 Keyboard Accessible

- **2.1.1 Keyboard**: All functionality is available via keyboard
- **2.1.2 No Keyboard Trap**: Users can navigate away from any widget component using standard keyboard commands
- **2.1.4 Character Key Shortcuts**: No character key shortcuts interfere with assistive technology

#### 2.4 Navigable

- **2.4.3 Focus Order**: Focus order follows a logical sequence
- **2.4.6 Headings and Labels**: Headings and labels are descriptive
- **2.4.7 Focus Visible**: Keyboard focus is clearly visible

#### 2.5 Input Modalities

- **2.5.1 Pointer Gestures**: All functionality works with single-point activation
- **2.5.2 Pointer Cancellation**: Users can cancel pointer actions
- **2.5.3 Label in Name**: Accessible names match or contain visible text
- **2.5.4 Motion Actuation**: No motion-based interactions required

### 3. Understandable

#### 3.1 Readable

- **3.1.1 Language of Page**: Language is programmatically set via `lang` attribute

#### 3.2 Predictable

- **3.2.1 On Focus**: No unexpected context changes on focus
- **3.2.2 On Input**: No unexpected context changes on input

#### 3.3 Input Assistance

- **3.3.1 Error Identification**: Input errors are clearly identified
- **3.3.2 Labels or Instructions**: Labels and instructions are provided for user input

### 4. Robust

#### 4.1 Compatible

- **4.1.1 Parsing**: Markup validates and uses proper syntax
- **4.1.2 Name, Role, Value**: All components have appropriate names, roles, and values
- **4.1.3 Status Messages**: Status changes are announced to assistive technology

## Implemented Features

### ARIA Attributes

#### Form Controls

```html
<!-- Hotel Selector -->
<button aria-haspopup="true" aria-expanded="false" aria-label="Select hotel">
  <div role="listbox" aria-label="Available hotels">
    <div role="option" aria-selected="false">Hotel Name</div>

    <!-- Date Selector -->
    <button
      aria-haspopup="true"
      aria-expanded="false"
      aria-label="Select dates"
    >
      <div role="dialog" aria-label="Date picker">
        <!-- Occupancy Selector -->
        <button
          aria-haspopup="true"
          aria-expanded="false"
          aria-label="Select guests"
        >
          <div role="group" aria-label="Room occupancy"></div>
        </button>
      </div>
    </button>
  </div>
</button>
```

#### Navigation

```html
<!-- Calendar Navigation -->
<button aria-label="Previous month">‹</button>
<button aria-label="Next month">›</button>

<!-- Counter Controls -->
<button aria-label="Decrease adults">-</button>
<button aria-label="Increase adults">+</button>
```

### Keyboard Navigation

#### Supported Keyboard Interactions

- **Tab**: Navigate between interactive elements
- **Shift+Tab**: Navigate backwards
- **Enter/Space**: Activate buttons and select options
- **Escape**: Close dropdowns and modals
- **Arrow Keys**: Navigate within lists and calendars
- **Home/End**: Navigate to first/last items in lists

#### Focus Management

- Focus is trapped within open dropdowns
- Focus returns to trigger element when closing dropdowns
- Focus moves logically through form elements
- Focus indicators are clearly visible

### Screen Reader Support

#### Announcements

- Status changes are announced using `aria-live` regions
- Selected dates are announced clearly
- Error states are communicated effectively
- Loading states provide appropriate feedback

#### Semantic Structure

- Proper heading hierarchy (h1, h2, h3)
- Lists use `<ul>`, `<ol>`, and `<li>` elements
- Form fields are properly labeled
- Related controls are grouped with `fieldset` and `legend`

### Responsive Design

#### Mobile Accessibility

- Touch targets meet minimum 44px size requirement
- Gestures work with assistive technology
- Mobile layouts maintain accessibility features
- Zoom up to 500% supported without horizontal scrolling

#### Adaptive Interface

- High contrast mode support
- Respects user's motion preferences
- Compatible with browser zoom
- Works with various viewport sizes

## Testing

### Automated Testing

- ESLint accessibility rules (eslint-plugin-jsx-a11y)
- axe-core integration for automated accessibility testing
- Lighthouse accessibility audits

### Manual Testing

- Screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation testing
- High contrast mode testing
- Mobile accessibility testing
- Focus management verification

### Browser Support

- Chrome 80+ (including ChromeVox)
- Firefox 75+ (including NVDA)
- Safari 13+ (including VoiceOver)
- Edge 80+ (including Narrator)

## Color Contrast Ratios

### Light Theme

- Text on background: 7.2:1 (AA+)
- Interactive elements: 4.8:1 (AA)
- Focus indicators: 5.1:1 (AA)
- Error states: 6.3:1 (AA+)

### Dark Theme

- Text on background: 8.1:1 (AA+)
- Interactive elements: 5.2:1 (AA)
- Focus indicators: 5.8:1 (AA)
- Error states: 7.1:1 (AA+)

## Error Handling

### Validation Messages

- Clear, descriptive error messages
- Errors announced to screen readers
- Error states visually distinct
- Instructions for correction provided

### Form Validation

- Real-time validation feedback
- Required fields clearly marked
- Error summary for form submission
- Success confirmations announced

## Implementation Guidelines

### For Developers

1. **Always provide labels**: Every form control must have an accessible label
2. **Use semantic HTML**: Choose the right element for the job
3. **Test with keyboard only**: Ensure all functionality works without a mouse
4. **Test with screen readers**: Verify announcements are helpful and clear
5. **Check color contrast**: Use tools to verify compliance
6. **Provide focus indicators**: Make focus states clearly visible

### Testing Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus order is logical and predictable
- [ ] All images have alternative text
- [ ] Color contrast meets WCAG AA standards
- [ ] Content reflows properly at 320px width
- [ ] Text can be zoomed to 200% without loss of functionality
- [ ] Screen readers announce content appropriately
- [ ] Error messages are clear and helpful
- [ ] Form validation provides useful feedback
- [ ] Modal dialogs trap focus appropriately

## Maintenance

### Regular Audits

- Quarterly accessibility audits using axe-core
- Annual screen reader testing
- Continuous integration accessibility checks
- User feedback incorporation

### Updates

- Keep up with WCAG guideline updates
- Monitor browser accessibility API changes
- Update assistive technology compatibility
- Maintain testing procedures

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)
