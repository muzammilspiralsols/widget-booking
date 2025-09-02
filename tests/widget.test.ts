import { WidgetSearch, initializeWidgets } from "../src/index";
import { parseConfig } from "../src/types/config";
import {
  createWidgetContainer,
  cleanupDOM,
  expectToHaveAttribute,
} from "./setup";

// Mock the components to focus on widget logic
jest.mock("../src/components/render", () => ({
  renderWidget: jest.fn(),
  renderModalWidget: jest.fn(),
}));

jest.mock("../src/components/events", () => ({
  attachEvents: jest.fn(),
}));

// Import mocked modules
import { renderWidget, renderModalWidget } from "../src/components/render";
import { attachEvents } from "../src/components/events";

const mockRenderWidget = renderWidget as jest.MockedFunction<
  typeof renderWidget
>;
const mockRenderModalWidget = renderModalWidget as jest.MockedFunction<
  typeof renderModalWidget
>;
const mockAttachEvents = attachEvents as jest.MockedFunction<
  typeof attachEvents
>;

describe("Widget Integration Tests", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock window.innerWidth for responsive tests
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200,
    });
  });

  afterEach(() => {
    cleanupDOM();

    // Clean up any global event listeners
    const modalOverlay = document.querySelector(".widget-modal-overlay");
    if (modalOverlay) {
      modalOverlay.remove();
    }
  });

  describe("Widget Initialization", () => {
    test("should initialize widget with default configuration", () => {
      const container = createWidgetContainer();
      const widget = new WidgetSearch(container, parseConfig(container));

      expect(mockRenderWidget).toHaveBeenCalledWith(
        container,
        expect.objectContaining({
          bookId: "12345",
          type: "hotel",
          layout: "inline",
        })
      );

      expect(mockAttachEvents).toHaveBeenCalledWith(
        container,
        expect.any(Object),
        widget
      );
      expectToHaveAttribute(container, "data-widget-initialized", "true");
    });

    test("should initialize widget with custom configuration", () => {
      const container = createWidgetContainer("widget-test", {
        "data-type": "chain",
        "data-layout": "column",
        "data-theme": "dark",
        "data-currency": "EUR",
      });

      const widget = new WidgetSearch(container, parseConfig(container));

      expect(mockRenderWidget).toHaveBeenCalledWith(
        container,
        expect.objectContaining({
          type: "chain",
          layout: "column",
          theme: "dark",
          currency: "EUR",
        })
      );
    });

    test("should call render and attach events in correct order", () => {
      const container = createWidgetContainer();
      new WidgetSearch(container, parseConfig(container));

      expect(mockRenderWidget).toHaveBeenCalled();
      expect(mockAttachEvents).toHaveBeenCalled();

      // Verify render was called before attach events by checking call order
      const renderCallOrder = mockRenderWidget.mock.invocationCallOrder[0];
      const eventsCallOrder = mockAttachEvents.mock.invocationCallOrder[0];
      expect(renderCallOrder).toBeLessThan(eventsCallOrder);
    });
  });

  describe("Modal Functionality", () => {
    test("should open modal correctly", () => {
      const container = createWidgetContainer();
      container.innerHTML = '<div class="widget-search">Widget Content</div>';

      const widget = new WidgetSearch(container, parseConfig(container));
      widget.openModal();

      const overlay = document.querySelector(".widget-modal-overlay");
      const modal = document.querySelector(".widget-modal");
      const closeBtn = document.querySelector(".widget-modal-close");

      expect(overlay).toBeTruthy();
      expect(modal).toBeTruthy();
      expect(closeBtn).toBeTruthy();
      expect(document.body.contains(overlay)).toBe(true);
    });

    test("should not open modal if already open", () => {
      const container = createWidgetContainer();
      container.innerHTML = '<div class="widget-search">Widget Content</div>';

      const widget = new WidgetSearch(container, parseConfig(container));

      // Open modal first time
      widget.openModal();
      const firstOverlay = document.querySelector(".widget-modal-overlay");

      // Try to open again
      widget.openModal();
      const overlays = document.querySelectorAll(".widget-modal-overlay");

      expect(overlays).toHaveLength(1);
      expect(overlays[0]).toBe(firstOverlay);
    });

    test("should close modal correctly", () => {
      const container = createWidgetContainer();
      container.innerHTML = '<div class="widget-search">Widget Content</div>';

      const widget = new WidgetSearch(container, parseConfig(container));

      // Open modal
      widget.openModal();
      expect(document.querySelector(".widget-modal-overlay")).toBeTruthy();

      // Close modal
      widget.closeModal();
      expect(document.querySelector(".widget-modal-overlay")).toBeNull();
    });

    test("should close modal when clicking overlay", () => {
      const container = createWidgetContainer();
      container.innerHTML = '<div class="widget-search">Widget Content</div>';

      const widget = new WidgetSearch(container, parseConfig(container));
      widget.openModal();

      const overlay = document.querySelector(
        ".widget-modal-overlay"
      ) as HTMLElement;
      expect(overlay).toBeTruthy();

      // Simulate click on overlay (not on modal content)
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      Object.defineProperty(clickEvent, "target", {
        value: overlay,
        writable: false,
      });

      overlay.dispatchEvent(clickEvent);

      // Modal should be closed
      expect(document.querySelector(".widget-modal-overlay")).toBeNull();
    });

    test("should close modal when clicking close button", () => {
      const container = createWidgetContainer();
      container.innerHTML = '<div class="widget-search">Widget Content</div>';

      const widget = new WidgetSearch(container, parseConfig(container));
      widget.openModal();

      const closeBtn = document.querySelector(
        ".widget-modal-close"
      ) as HTMLElement;
      expect(closeBtn).toBeTruthy();

      closeBtn.click();

      expect(document.querySelector(".widget-modal-overlay")).toBeNull();
    });

    test("should close modal on Escape key", () => {
      const container = createWidgetContainer();
      container.innerHTML = '<div class="widget-search">Widget Content</div>';

      const widget = new WidgetSearch(container, parseConfig(container));
      widget.openModal();

      // Simulate Escape key press
      const escapeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      });

      document.dispatchEvent(escapeEvent);

      expect(document.querySelector(".widget-modal-overlay")).toBeNull();
    });

    test("should not close modal on other key presses", () => {
      const container = createWidgetContainer();
      container.innerHTML = '<div class="widget-search">Widget Content</div>';

      const widget = new WidgetSearch(container, parseConfig(container));
      widget.openModal();

      // Simulate other key press
      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      });

      document.dispatchEvent(enterEvent);

      expect(document.querySelector(".widget-modal-overlay")).toBeTruthy();
    });

    test("should re-attach events to modal widget", () => {
      const container = createWidgetContainer();
      container.innerHTML = '<div class="widget-search">Widget Content</div>';

      const widget = new WidgetSearch(container, parseConfig(container));

      // Clear previous calls
      mockAttachEvents.mockClear();

      widget.openModal();

      // Should be called again for the modal
      expect(mockAttachEvents).toHaveBeenCalledTimes(1);
      expect(mockAttachEvents).toHaveBeenCalledWith(
        expect.any(HTMLElement), // modal container
        expect.any(Object), // config
        widget // widget instance
      );
    });
  });

  describe("updateConfig method", () => {
    test("should update configuration and re-initialize", () => {
      const container = createWidgetContainer();
      const widget = new WidgetSearch(container, parseConfig(container));

      // Clear initial calls
      mockRenderWidget.mockClear();
      mockAttachEvents.mockClear();

      // Update config
      const newConfig = { theme: "dark" as const, currency: "EUR" };
      widget.updateConfig(newConfig);

      // Should re-render with updated config
      expect(mockRenderWidget).toHaveBeenCalledWith(
        container,
        expect.objectContaining({
          theme: "dark",
          currency: "EUR",
        })
      );

      expect(mockAttachEvents).toHaveBeenCalledWith(
        container,
        expect.any(Object),
        widget
      );
    });

    test("should merge new config with existing config", () => {
      const container = createWidgetContainer("widget-test", {
        "data-type": "chain",
        "data-layout": "column",
      });
      const widget = new WidgetSearch(container, parseConfig(container));

      mockRenderWidget.mockClear();

      widget.updateConfig({ theme: "dark" });

      expect(mockRenderWidget).toHaveBeenCalledWith(
        container,
        expect.objectContaining({
          type: "chain", // Original value preserved
          layout: "column", // Original value preserved
          theme: "dark", // New value applied
        })
      );
    });
  });

  describe("Auto-initialization", () => {
    test("should auto-initialize widgets on DOM ready", () => {
      // Create multiple widget containers
      const container1 = createWidgetContainer("widget-search-1");
      const container2 = createWidgetContainer("widget-search-2", {
        "data-type": "chain",
      });

      // Mock document.readyState
      Object.defineProperty(document, "readyState", {
        writable: true,
        value: "complete",
      });

      // Trigger auto-initialization
      initializeWidgets();

      // Both widgets should be initialized
      expectToHaveAttribute(container1, "data-widget-initialized", "true");
      expectToHaveAttribute(container2, "data-widget-initialized", "true");
    });

    test("should not re-initialize already initialized widgets", () => {
      const container = createWidgetContainer();
      container.setAttribute("data-widget-initialized", "true");

      mockRenderWidget.mockClear();
      initializeWidgets();

      // Should not render again
      expect(mockRenderWidget).not.toHaveBeenCalled();
    });
  });

  describe("Responsive behavior", () => {
    test("should re-initialize widgets on window resize", (done) => {
      const container = createWidgetContainer();
      new WidgetSearch(container, parseConfig(container));

      // Clear initial calls
      mockRenderWidget.mockClear();
      mockAttachEvents.mockClear();

      // Change window size and trigger resize event
      window.innerWidth = 800;
      window.dispatchEvent(new Event("resize"));

      // Wait for debounce
      setTimeout(() => {
        expect(mockRenderWidget).toHaveBeenCalled();
        expect(mockAttachEvents).toHaveBeenCalled();
        done();
      }, 300); // Wait longer than the 250ms debounce
    });

    test("should debounce resize events", (done) => {
      const container = createWidgetContainer();
      new WidgetSearch(container, parseConfig(container));

      mockRenderWidget.mockClear();

      // Trigger multiple resize events quickly
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("resize"));

      // Should not be called immediately
      expect(mockRenderWidget).not.toHaveBeenCalled();

      // Wait for debounce and check it was only called once
      setTimeout(() => {
        expect(mockRenderWidget).toHaveBeenCalledTimes(1);
        done();
      }, 300);
    });
  });

  describe("Global API exposure", () => {
    test("should expose WidgetSearch class globally", () => {
      expect(window.WidgetSearch).toBe(WidgetSearch);
    });

    test("should expose initializeWidgetSearch function globally", () => {
      expect(typeof window.initializeWidgetSearch).toBe("function");
    });
  });

  describe("Error handling", () => {
    test("should handle missing widget content gracefully", () => {
      const container = createWidgetContainer();
      // Don't add widget content

      const widget = new WidgetSearch(container, parseConfig(container));

      // Should not throw when trying to open modal without content
      expect(() => widget.openModal()).not.toThrow();

      // Should still close modal safely
      expect(() => widget.closeModal()).not.toThrow();
    });

    test("should handle multiple modal close calls gracefully", () => {
      const container = createWidgetContainer();
      const widget = new WidgetSearch(container, parseConfig(container));

      // Should not throw when closing modal that's not open
      expect(() => widget.closeModal()).not.toThrow();
      expect(() => widget.closeModal()).not.toThrow();
    });
  });
});
