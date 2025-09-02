// Widget Entry Point
import { WidgetConfig, parseConfig } from "./types/config";
import { renderWidget, renderModalWidget, renderCalendar } from "./components/render";
import { attachEvents } from "./components/events";
import { formatDate, t } from "./utils/utils";
import "./styles/widget.scss";

interface UpdateDataParams {
  idHotel?: string;
  promoCode?: string;
  openCalendar?: boolean;
  checkIn?: string; // DD-MM-YYYY format
  checkOut?: string; // DD-MM-YYYY format
  minDate?: string; // DD-MM-YYYY format
  maxDate?: string; // DD-MM-YYYY format
}

class WidgetSearch {
  private container: HTMLElement;
  private config: WidgetConfig;
  private isModalOpen: boolean = false;

  constructor(container: HTMLElement, config: WidgetConfig) {
    this.container = container;
    this.config = config;
    this.init();
  }

  private init() {
    // Render the widget
    renderWidget(this.container, this.config);

    // Attach event listeners
    attachEvents(this.container, this.config, this);

    // Mark as initialized
    this.container.setAttribute("data-widget-initialized", "true");
  }

  public openModal() {
    if (this.isModalOpen) return;

    this.isModalOpen = true;

    // Hide ALL widget containers when modal opens
    const allWidgets = document.querySelectorAll('.widget-search-container');
    allWidgets.forEach(widget => {
      (widget as HTMLElement).style.display = "none";
    });

    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "widget-modal-overlay";

    // Create modal container
    const modal = document.createElement("div");
    modal.className = "widget-modal";

    // Create modal content wrapper
    const modalContent = document.createElement("div");
    modalContent.className = "widget-modal-content";

    // Create a new widget container for the modal with full form
    const modalContainer = document.createElement("div");
    modalContainer.className = "widget-search-container column light";
    modalContainer.id = "modal-widget-container";

    // Render the full widget form in the modal (force desktop layout)
    renderModalWidget(modalContainer, this.config);

    // Add close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "widget-modal-close";
    closeBtn.innerHTML = "×";
    closeBtn.setAttribute("aria-label", "Close search");

    // Assemble modal structure
    modalContent.appendChild(modalContainer);
    modal.appendChild(closeBtn);
    modal.appendChild(modalContent);
    overlay.appendChild(modal);

    document.body.appendChild(overlay);

    // Re-attach events to modal widget
    attachEvents(modalContainer, this.config, this);

    // Handle close
    const closeModal = () => this.closeModal();
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });

    // Handle ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
  }

  public closeModal() {
    // Show ALL widget containers again when modal closes
    const allWidgets = document.querySelectorAll('.widget-search-container');
    allWidgets.forEach(widget => {
      const widgetElement = widget as HTMLElement;
      // Remove any inline styles that might have been added
      widgetElement.style.display = "";
      widgetElement.style.visibility = "";
      widgetElement.style.opacity = "";
      widgetElement.style.position = "";
      widgetElement.style.bottom = "";
      widgetElement.style.left = "";
      widgetElement.style.transform = "";
      widgetElement.style.zIndex = "";
    });
    
    const overlay = document.querySelector(".widget-modal-overlay");
    if (overlay) {
      overlay.remove();
    }
    this.isModalOpen = false;
  }

  public updateConfig(newConfig: Partial<WidgetConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.init();
  }

  public updateData(data: UpdateDataParams) {
    // Update hotel selection
    if (data.idHotel) {
      this.updateHotelSelection(data.idHotel);
    }

    // Update promo code (including clearing with empty string)
    if (data.promoCode !== undefined) {
      this.updatePromoCode(data.promoCode);
    }

    // Update dates
    if (data.checkIn) {
      this.updateCheckInDate(data.checkIn);
    }

    if (data.checkOut) {
      this.updateCheckOutDate(data.checkOut);
    }

    // If both dates are provided, update display with both
    if (data.checkIn && data.checkOut) {
      const checkInDate = this.parseDateString(data.checkIn);
      const checkOutDate = this.parseDateString(data.checkOut);
      if (checkInDate && checkOutDate) {
        this.updateDateDisplay(checkInDate, checkOutDate);
      }
    }

    // Update date constraints
    if (data.minDate) {
      this.updateMinDate(data.minDate);
    }

    if (data.maxDate) {
      this.updateMaxDate(data.maxDate);
    }

    // Open calendar if requested
    if (data.openCalendar) {
      this.openCalendar();
    }
  }

  public updateParams(params: Record<string, string>) {
    // Store additional parameters for URL building
    this.container.setAttribute("data-additional-params", JSON.stringify(params));
    
    // Also update the widget state directly to ensure it's cleared
    const widgetState = (this as any).__state;
    if (widgetState) {
      widgetState.additionalParams = { ...params };
    }
    
    // Dispatch custom event to notify the widget
    const event = new CustomEvent("widgetUpdateParams", {
      detail: params,
      bubbles: true
    });
    this.container.dispatchEvent(event);
  }

  private updateHotelSelection(hotelId: string) {
    const hotelSelector = this.container.querySelector(".hotel-selector");
    if (hotelSelector) {
      const trigger = hotelSelector.querySelector(".field-trigger") as HTMLElement;
      const valueElement = trigger?.querySelector(".field-value") as HTMLElement;
      
      if (valueElement) {
        // Update the display text
        const hotelName = this.getHotelNameById(hotelId);
        valueElement.textContent = hotelName || hotelId;
      }

      // Update selected state in dropdown
      const options = hotelSelector.querySelectorAll(".hotel-option");
      options.forEach((option) => {
        option.classList.remove("selected");
        if (option.getAttribute("data-hotel-id") === hotelId) {
          option.classList.add("selected");
        }
      });
    }
  }

  private updatePromoCode(promoCode: string) {
    const promoInput = this.container.querySelector(".promo-input") as HTMLInputElement;
    if (promoInput) {
      promoInput.value = promoCode;
      
      // Update the widget's internal state
      const widgetState = (this as any).__state;
      if (widgetState) {
        widgetState.promoCode = promoCode;
      }
    }
  }

  private updateCheckInDate(dateStr: string) {
    const date = this.parseDateString(dateStr);
    if (date) {
      // Update widget state
      const widgetState = (this as any).__state;
      if (widgetState) {
        widgetState.checkInDate = date;
      }
      this.updateDateDisplay(date, null);
    }
  }

  private updateCheckOutDate(dateStr: string) {
    const date = this.parseDateString(dateStr);
    if (date) {
      // Update widget state
      const widgetState = (this as any).__state;
      if (widgetState) {
        widgetState.checkOutDate = date;
      }
      this.updateDateDisplay(null, date);
    }
  }

  private updateMinDate(dateStr: string) {
    const date = this.parseDateString(dateStr);
    if (date) {
      this.config.minDate = date;
    }
  }

  private updateMaxDate(dateStr: string) {
    const date = this.parseDateString(dateStr);
    if (date) {
      this.config.maxDate = date;
    }
  }

  private openCalendar() {
    const dateSelector = this.container.querySelector(".date-selector");
    if (dateSelector) {
      const trigger = dateSelector.querySelector(".field-trigger") as HTMLButtonElement;
      const dropdown = dateSelector.querySelector(".field-dropdown") as HTMLElement;
      const calendar = dateSelector.querySelector(".calendar-container") as HTMLElement;
      
      console.log("openCalendar called - elements found:", {
        dateSelector: !!dateSelector,
        trigger: !!trigger,
        dropdown: !!dropdown,
        calendar: !!calendar
      });
      
      if (trigger) {
        console.log("Trigger found, attempting click...");
        
        // Try multiple approaches
        try {
          // Method 1: Direct click
          trigger.click();
          console.log("Direct click attempted");
          
          // Method 2: Dispatch click event
          setTimeout(() => {
            const clickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window
            });
            trigger.dispatchEvent(clickEvent);
            console.log("Dispatched click event");
          }, 10);
          
          // Method 3: Manual opening as fallback
          setTimeout(() => {
            if (dropdown && calendar) {
              console.log("Fallback: Manual opening");
              dropdown.style.display = "block";
              trigger.setAttribute("aria-expanded", "true");
              
              const widgetState = (this as any).__state;
              if (widgetState) {
                renderCalendar(
                  calendar,
                  this.config,
                  {
                    checkIn: widgetState.checkInDate,
                    checkOut: widgetState.checkOutDate,
                  },
                  widgetState.currentCalendarMonth
                );
                console.log("Calendar rendered manually");
              }
            }
          }, 50);
          
        } catch (error) {
          console.error("Error in openCalendar:", error);
        }
      } else {
        console.error("Trigger not found");
      }
    } else {
      console.error("Date selector not found");
    }
  }

  private parseDateString(dateStr: string): Date | null {
    // Parse DD-MM-YYYY format
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Month is 0-indexed
      const year = parseInt(parts[2]);
      
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day, 12, 0, 0, 0);
      }
    }
    return null;
  }

  private updateDateDisplay(checkIn?: Date | null, checkOut?: Date | null) {
    const dateSelector = this.container.querySelector(".date-selector");
    if (dateSelector) {
      const trigger = dateSelector.querySelector(".field-trigger") as HTMLElement;
      const valueElement = trigger?.querySelector(".field-value") as HTMLElement;
      
      if (valueElement) {
        // Get current state if not provided
        const widgetState = (this as any).__state;
        const currentCheckIn = checkIn || (widgetState ? widgetState.checkInDate : null);
        const currentCheckOut = checkOut || (widgetState ? widgetState.checkOutDate : null);
        
        if (currentCheckIn && currentCheckOut) {
          const checkInFormatted = formatDate(currentCheckIn, "compact");
          const checkOutFormatted = formatDate(currentCheckOut, "compact");
          valueElement.textContent = `${checkInFormatted} — ${checkOutFormatted}`;
        } else if (currentCheckIn) {
          const checkInFormatted = formatDate(currentCheckIn, "compact");
          valueElement.textContent = `${checkInFormatted} — ${t("date.choose_checkout", this.config.locale)}`;
        } else if (currentCheckOut) {
          const checkOutFormatted = formatDate(currentCheckOut, "compact");
          valueElement.textContent = `Select checkin — ${checkOutFormatted}`;
        } else {
          valueElement.textContent = t("date.checkin_checkout", this.config.locale);
        }
      }
    }
  }

  private getHotelNameById(hotelId: string): string | null {
    // This would typically come from the hotel data
    // For now, return a simple mapping
    const hotelNames: Record<string, string> = {
      "all-hotels": "All Hotels",
      "playa-garden-selection-hotel-spa": "Playa Garden Selection Hotel & Spa",
      "alcudia-garden-aparthotel": "Alcudia Garden Aparthotel",
      // Add more mappings as needed
    };
    
    return hotelNames[hotelId] || hotelId;
  }
}

// Auto-initialize widgets on page load
function initializeWidgets() {
  const widgets = document.querySelectorAll(
    '[id^="widget-search"]:not([data-widget-initialized])'
  );

  widgets.forEach((element) => {
    const container = element as HTMLElement;
    const config = parseConfig(container);
    const widgetInstance = new WidgetSearch(container, config);
    // Store widget instance for external access
    (container as any).__widgetInstance = widgetInstance;
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWidgets);
} else {
  initializeWidgets();
}

// Add resize event listener for responsive updates
let resizeTimeout: number;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(() => {
    // Re-render widgets on resize to update responsiveness
    const widgets = document.querySelectorAll("[data-widget-initialized]");
    widgets.forEach((element) => {
      const container = element as HTMLElement;
      const config = parseConfig(container);

      // Remove the initialization flag to allow re-initialization
      container.removeAttribute("data-widget-initialized");

      // Re-initialize the widget with updated responsive behavior
      new WidgetSearch(container, config);
    });
  }, 250); // Debounce resize events
});

// Export for manual initialization
declare global {
  interface Window {
    WidgetSearch: typeof WidgetSearch;
    initializeWidgetSearch: typeof initializeWidgets;
    getWidgetInstance: (containerId: string) => WidgetSearch | null;
  }
}

window.WidgetSearch = WidgetSearch;
window.initializeWidgetSearch = initializeWidgets;

// Global function to get widget instance by container ID
window.getWidgetInstance = (containerId: string): WidgetSearch | null => {
  const container = document.getElementById(containerId);
  if (container && container.hasAttribute("data-widget-initialized")) {
    return (container as any).__widgetInstance || null;
  }
  return null;
};

export { WidgetSearch, initializeWidgets };
