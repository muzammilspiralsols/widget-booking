// Test setup file for Jest
import "jest-environment-jsdom";

// Mock CSS imports
jest.mock("../src/styles/widget.css", () => ({}));

// Setup DOM globals
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.open for search tests
Object.defineProperty(window, "open", {
  writable: true,
  value: jest.fn(),
});

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Helper to create widget container
export function createWidgetContainer(
  id: string = "widget-search-test",
  attributes: Record<string, string> = {}
): HTMLElement {
  const container = document.createElement("div");
  container.id = id;

  // Set default required attributes
  const defaultAttrs = {
    "data-book-id": "12345",
    "data-type": "hotel",
    ...attributes,
  };

  Object.entries(defaultAttrs).forEach(([key, value]) => {
    container.setAttribute(key, value);
  });

  document.body.appendChild(container);
  return container;
}

// Helper to clean up DOM after tests
export function cleanupDOM(): void {
  document.body.innerHTML = "";
  // Remove any modals or overlays
  document
    .querySelectorAll(".widget-modal-overlay")
    .forEach((el) => el.remove());
}

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Helper function to check attributes
export function expectToHaveAttribute(
  element: HTMLElement,
  attribute: string,
  value?: string
): void {
  expect(element.hasAttribute(attribute)).toBe(true);
  if (value !== undefined) {
    expect(element.getAttribute(attribute)).toBe(value);
  }
}
