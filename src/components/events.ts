import { WidgetConfig, getHotelById } from "../types/config";
import { formatDate, t } from "../utils/utils";
import { renderCalendar, renderOccupancyRooms } from "./render";

interface WidgetState {
  selectedHotel?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  rooms: Array<{
    adults: number;
    children: number;
    childAges: number[];
  }>;
  promoCode?: string;
  isSelectingCheckOut: boolean;
  currentCalendarMonth?: Date;
  additionalParams?: Record<string, string>;
}

interface WidgetInstance {
  openModal(): void;
  closeModal(): void;
  updateConfig(newConfig: unknown): void;
  updateData?(data: any): void;
  updateParams?(params: Record<string, string>): void;
}

export function attachEvents(
  container: HTMLElement,
  config: WidgetConfig,
  widget: WidgetInstance
): void {
  const state: WidgetState = {
    rooms: [
      {
        adults: config.defaultAdults,
        children: config.defaultChildren,
        childAges: [],
      },
    ],
    isSelectingCheckOut: false,
    selectedHotel: config.hotel,
    currentCalendarMonth: new Date(),
    additionalParams: {},
  };

  // Make state accessible to the widget instance
  (widget as any).__state = state;

  // Mobile trigger button
  const mobileButton = container.querySelector(".widget-search-mobile-trigger");
  if (mobileButton) {
    console.log("Mobile button found, attaching click event");
    mobileButton.addEventListener("click", () => {
      console.log("Mobile button clicked, calling openModal");
      if (widget && typeof widget.openModal === 'function') {
        widget.openModal();
      } else {
        console.error("Widget or openModal method not available:", widget);
      }
    });
    return; // For mobile, events will be attached to the modal
  }

  // Hotel selector events
  const hotelSelector = container.querySelector(
    ".hotel-selector"
  ) as HTMLElement;
  if (hotelSelector) {
    attachHotelSelectorEvents(hotelSelector, config, state);
  }

  // Date selector events
  const dateSelector = container.querySelector(".date-selector") as HTMLElement;
  if (dateSelector) {
    attachDateSelectorEvents(dateSelector, config, state);
  }

  // Occupancy selector events
  const occupancySelector = container.querySelector(
    ".occupancy-selector"
  ) as HTMLElement;
  if (occupancySelector) {
    attachOccupancySelectorEvents(occupancySelector, config, state);
  }

  // Promo code events
  const promoInput = container.querySelector(
    ".promo-input"
  ) as HTMLInputElement;
  if (promoInput) {
    promoInput.addEventListener("input", (e) => {
      const input = e.target as HTMLInputElement;
      const value = input.value;

      // Allow only alphanumeric characters
      const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, '');

      if (value !== alphanumericValue) {
        input.value = alphanumericValue;
      }

      state.promoCode = alphanumericValue;
    });
  }

  // Search form events
  const form = container.querySelector(".widget-form") as HTMLFormElement;
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSearch(config, state);
    });
  }

  // Click outside to close dropdowns
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!container.contains(target)) {
      // Check if any date selector is in selection mode
      const activeDateDropdown = container.querySelector(
        ".date-dropdown[style*='display: block']"
      );
      const isDateSelectionInProgress =
        activeDateDropdown &&
        state.checkInDate &&
        !state.checkOutDate &&
        state.isSelectingCheckOut;

      // On mobile, don't close certain dropdowns
      const isMobileView = window.innerWidth < 1024;

      // Check if occupancy dropdown is open on mobile
      const activeOccupancyDropdown = container.querySelector(
        ".occupancy-dropdown[style*='display: block']"
      );

      if (isMobileView) {
        // Don't close date dropdown if selection is in progress
        if (isDateSelectionInProgress) {
          return; // Don't close anything on mobile during date selection
        }

        // Don't close occupancy dropdown on mobile (only close via buttons)
        if (activeOccupancyDropdown) {
          return; // Don't close occupancy on mobile via outside click
        }
      }

      // Don't close dropdowns if date selection is in progress
      if (!isDateSelectionInProgress) {
        closeAllDropdowns(container);
      }
    }
  });

  // Initially render occupancy rooms
  const occupancyDropdown = container.querySelector(
    ".occupancy-dropdown .rooms-container"
  );
  if (occupancyDropdown) {
    renderOccupancyRooms(occupancyDropdown as HTMLElement, config, state.rooms);
  }

  // Listen for updateParams events
  container.addEventListener("widgetUpdateParams", (e: Event) => {
    const customEvent = e as CustomEvent;
    const params = customEvent.detail;
    state.additionalParams = { ...state.additionalParams, ...params };
  });

  // Listen for additional params from data attribute
  const additionalParamsAttr = container.getAttribute("data-additional-params");
  if (additionalParamsAttr) {
    try {
      const params = JSON.parse(additionalParamsAttr);
      state.additionalParams = { ...state.additionalParams, ...params };
    } catch (error) {
      console.warn("Invalid additional params JSON:", error);
    }
  }
}

function attachHotelSelectorEvents(
  selector: HTMLElement,
  config: WidgetConfig,
  state: WidgetState
): void {
  const trigger = selector.querySelector(".field-trigger") as HTMLButtonElement;
  const dropdown = selector.querySelector(".field-dropdown") as HTMLElement;
  const searchInput = selector.querySelector(
    ".search-input"
  ) as HTMLInputElement;
  const hotelsList = selector.querySelector(".hotels-list") as HTMLElement;

  // Toggle dropdown
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdown.style.display !== "none";
    closeAllDropdowns(
      selector.closest(".widget-search-container") as HTMLElement
    );

    if (!isOpen) {
      dropdown.style.display = "block";
      trigger.setAttribute("aria-expanded", "true");
      searchInput.focus();
    }
  });

  // Search functionality with debouncing
  let searchTimeout: number;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = window.setTimeout(() => {
      filterHotels(hotelsList, searchInput.value, config);
    }, 150); // Debounce search by 150ms
  });

  // Keyboard navigation for hotel search
  searchInput.addEventListener("keydown", (e) => {
    handleHotelSearchKeyboard(e, hotelsList, searchInput);
  });

  // Hotel selection
  hotelsList.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const hotelOption = target.closest(".hotel-option") as HTMLElement;

    if (hotelOption) {
      const hotelId = hotelOption.getAttribute("data-hotel-id");
      if (hotelId) {
        selectHotel(selector, config, state, hotelId);
        dropdown.style.display = "none";
        trigger.setAttribute("aria-expanded", "false");

        // Focus next field (date selector)
        const dateSelector = selector
          .closest(".widget-search-container")
          ?.querySelector(".date-selector .field-trigger") as HTMLButtonElement;
        if (dateSelector) {
          dateSelector.focus();
        }
      }
    }
  });
}

function attachDateSelectorEvents(
  selector: HTMLElement,
  config: WidgetConfig,
  state: WidgetState
): void {
  const trigger = selector.querySelector(".field-trigger") as HTMLButtonElement;
  const dropdown = selector.querySelector(".field-dropdown") as HTMLElement;
  const calendar = selector.querySelector(".calendar-container") as HTMLElement;

  // Calendar sheet close button (mobile/tablet)
  const closeButton = selector.querySelector(
    ".calendar-sheet-close"
  ) as HTMLButtonElement;
  if (closeButton) {
    closeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.style.display = "none";
      trigger.setAttribute("aria-expanded", "false");
    });
  }

  // Toggle dropdown
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdown.style.display !== "none";

    if (isOpen) {
      // If calendar is open, close it
      dropdown.style.display = "none";
      trigger.setAttribute("aria-expanded", "false");
    } else {
      // Close other dropdowns but keep date calendar open if it's in selection mode
      closeAllDropdowns(
        selector.closest(".widget-search-container") as HTMLElement,
        true // Don't close date calendar if it's active
      );

      dropdown.style.display = "block";
      trigger.setAttribute("aria-expanded", "true");
      renderCalendar(
        calendar,
        config,
        {
          checkIn: state.checkInDate,
          checkOut: state.checkOutDate,
        },
        state.currentCalendarMonth
      );

      // Initialize calendar actions on first open
      updateCalendarActions(selector, state, config);
    }
  });

  // Quick date buttons (mobile only)
  const quickDateButtons = selector.querySelectorAll(".quick-date-btn");
  quickDateButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const dateStr = (e.target as HTMLElement).getAttribute("data-date");
      if (dateStr) {
        const parts = dateStr.split("-");
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        const selectedDate = new Date(year, month, day, 12, 0, 0, 0);
        handleDateSelection(selector, config, state, selectedDate);
      }
    });
  });

  // Calendar navigation and date selection will be handled by event delegation
  calendar.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent interference with other click handlers
    const target = e.target as HTMLElement;

    // Debug logging removed - calendar working correctly

    // Check if target is a calendar day or if we clicked on a child element (like price)
    let calendarDay = target;
    if (!target.classList.contains("calendar-day")) {
      // If we clicked on a child element (like .day-price), find the parent calendar day
      calendarDay = target.closest(".calendar-day") as HTMLElement;
    }

    if (
      calendarDay &&
      calendarDay.classList.contains("calendar-day") &&
      !calendarDay.classList.contains("disabled") &&
      !(calendarDay as HTMLButtonElement).disabled
    ) {
      // Ensure the target is still in the DOM
      if (!document.contains(calendarDay)) {
        return;
      }

      // Calendar day processing
      const dateStr = calendarDay.getAttribute("data-date");
      if (dateStr) {
        // Validate date string format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          console.warn("Invalid date format:", dateStr);
          return;
        }

        // Parse date string as local date to avoid timezone issues
        const parts = dateStr.split("-");
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Month is 0-indexed
        const day = parseInt(parts[2]);

        // Validate parsed values
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          console.warn("Invalid date components:", { year, month, day });
          return;
        }

        // Create date at noon to avoid timezone edge cases
        const selectedDate = new Date(year, month, day, 12, 0, 0, 0);

        // Ensure the date was created successfully
        if (isNaN(selectedDate.getTime())) {
          console.warn("Invalid date created:", selectedDate);
          return;
        }

        // Add visual feedback for click
        calendarDay.style.transform = "scale(0.95)";
        setTimeout(() => {
          if (document.contains(calendarDay)) {
            calendarDay.style.transform = "";
          }
        }, 150);

        handleDateSelection(selector, config, state, selectedDate);
      }
    }

    if (target.classList.contains("calendar-nav")) {
      e.preventDefault();
      e.stopPropagation();

      // Handle month navigation
      const currentMonth = state.currentCalendarMonth || new Date();
      const newMonth = new Date(currentMonth);

      if (target.classList.contains("prev")) {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }

      // Update the state with new month
      state.currentCalendarMonth = newMonth;

      // Update calendar with new month
      renderCalendar(
        calendar,
        config,
        {
          checkIn: state.checkInDate,
          checkOut: state.checkOutDate,
        },
        newMonth
      );

      // Maintain calendar actions after month navigation
      updateCalendarActions(selector, state, config);
    }
  });
}

function attachOccupancySelectorEvents(
  selector: HTMLElement,
  config: WidgetConfig,
  state: WidgetState
): void {
  const trigger = selector.querySelector(".field-trigger") as HTMLButtonElement;
  const dropdown = selector.querySelector(".field-dropdown") as HTMLElement;
  const roomsContainer = selector.querySelector(
    ".rooms-container"
  ) as HTMLElement;
  const addRoomBtn = selector.querySelector(
    ".add-room-btn"
  ) as HTMLButtonElement;

  // Occupancy sheet close button (mobile/tablet)
  const closeButton = selector.querySelector(
    ".occupancy-sheet-close"
  ) as HTMLButtonElement;
  if (closeButton) {
    closeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.style.display = "none";
      trigger.setAttribute("aria-expanded", "false");
    });
  }

  // Occupancy confirm button (mobile/tablet)
  const confirmButton = selector.querySelector(
    ".occupancy-confirm-btn"
  ) as HTMLButtonElement;
  if (confirmButton) {
    confirmButton.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.style.display = "none";
      trigger.setAttribute("aria-expanded", "false");

      // Focus next field or search button
      const searchButton = selector
        .closest(".widget-search-container")
        ?.querySelector(".search-btn") as HTMLButtonElement;
      if (searchButton) {
        searchButton.focus();
      }
    });
  }

  // Toggle dropdown
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdown.style.display !== "none";
    closeAllDropdowns(
      selector.closest(".widget-search-container") as HTMLElement
    );

    if (!isOpen) {
      dropdown.style.display = "block";
      trigger.setAttribute("aria-expanded", "true");
      renderOccupancyRooms(roomsContainer, config, state.rooms);
    }
  });

  // Prevent dropdown from closing when clicking inside it
  dropdown.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Add room button
  addRoomBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent closing dropdown
    if (state.rooms.length < config.maxRooms) {
      state.rooms.push({ adults: 1, children: 0, childAges: [] });
      renderOccupancyRooms(roomsContainer, config, state.rooms);
      updateOccupancyDisplay(selector, state, config);
    }
  });

  // Room controls (event delegation)
  roomsContainer.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent closing dropdown when clicking controls
    const target = e.target as HTMLElement;

    // Remove room
    if (target.classList.contains("remove-room-btn")) {
      const roomIndex = parseInt(target.getAttribute("data-room-index") || "0");
      state.rooms.splice(roomIndex, 1);
      renderOccupancyRooms(roomsContainer, config, state.rooms);
      updateOccupancyDisplay(selector, state, config);
    }

    // Counter buttons
    if (target.classList.contains("counter-btn")) {
      const counter = target.closest(".counter") as HTMLElement;
      const roomIndex = parseInt(
        counter.getAttribute("data-room-index") || "0"
      );
      const type = counter.getAttribute("data-type") as "adults" | "children";
      const isIncrease = target.classList.contains("increase");

      handleCounterChange(selector, config, state, roomIndex, type, isIncrease);
    }
  });

  // Child age selects (event delegation)
  roomsContainer.addEventListener("change", (e) => {
    e.stopPropagation(); // Prevent closing dropdown when changing child ages
    const target = e.target as HTMLSelectElement;

    if (target.classList.contains("child-age-select")) {
      const roomIndex = parseInt(target.getAttribute("data-room-index") || "0");
      const childIndex = parseInt(
        target.getAttribute("data-child-index") || "0"
      );
      const age = parseInt(target.value);

      state.rooms[roomIndex].childAges[childIndex] = age;
    }
  });
}

function selectHotel(
  selector: HTMLElement,
  config: WidgetConfig,
  state: WidgetState,
  hotelId: string
): void {
  state.selectedHotel = hotelId;

  // Update config with selected hotel for price updates
  config.hotel = hotelId;

  const trigger = selector.querySelector(".field-trigger") as HTMLElement;
  const valueElement = trigger.querySelector(".field-value") as HTMLElement;

  const hotel = getHotelById(hotelId);
  if (hotel) {
    valueElement.textContent = hotel.name;
  }

  // Update selected state in dropdown
  const options = selector.querySelectorAll(".hotel-option");
  options.forEach((option) => {
    option.classList.remove("selected");
    if (option.getAttribute("data-hotel-id") === hotelId) {
      option.classList.add("selected");
    }
  });

  // Update calendar prices if date selector is open
  const container = selector.closest(".widget-search-container") as HTMLElement;
  const dateDropdown = container.querySelector(".date-dropdown") as HTMLElement;
  if (dateDropdown && dateDropdown.style.display !== "none") {
    const calendar = dateDropdown.querySelector(
      ".calendar-container"
    ) as HTMLElement;
    if (calendar) {
      renderCalendar(
        calendar,
        config,
        {
          checkIn: state.checkInDate,
          checkOut: state.checkOutDate,
        },
        state.currentCalendarMonth
      );
    }
  }
}

// Debounce mechanism to prevent multiple rapid clicks on the same date
let lastSelectedDate: string | null = null;
let lastSelectionTime = 0;

function handleDateSelection(
  selector: HTMLElement,
  config: WidgetConfig,
  state: WidgetState,
  selectedDate: Date
): void {
  // Create a unique identifier for this date selection
  const currentDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD format
  const currentTime = Date.now();

  // Only prevent if it's the same date clicked within 200ms
  if (
    lastSelectedDate === currentDate &&
    currentTime - lastSelectionTime < 200
  ) {
    // Prevent duplicate rapid clicks on same date
    return;
  }

  lastSelectedDate = currentDate;
  lastSelectionTime = currentTime;
  // Validate date constraints before processing selection
  // Normalize dates to compare only date parts (ignore time)
  const today = new Date();
  const selectedDateOnly = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // Only consider dates as "past" if they're before today AND before the configured min date
  let isPastDate = selectedDateOnly < todayOnly;
  if (config.minDate && isPastDate) {
    const minDateOnly = new Date(
      config.minDate.getFullYear(),
      config.minDate.getMonth(),
      config.minDate.getDate()
    );
    // If date is within the allowed range (>= minDate), don't consider it as "past"
    if (selectedDateOnly >= minDateOnly) {
      isPastDate = false;
    }
  }

  let isBeyondMaxDate = false;
  if (config.maxDate) {
    const maxDateOnly = new Date(
      config.maxDate.getFullYear(),
      config.maxDate.getMonth(),
      config.maxDate.getDate()
    );
    isBeyondMaxDate = selectedDateOnly > maxDateOnly;
  }

  let isBeyondMinDate = false;
  if (config.minDate) {
    const minDateOnly = new Date(
      config.minDate.getFullYear(),
      config.minDate.getMonth(),
      config.minDate.getDate()
    );
    isBeyondMinDate = selectedDateOnly < minDateOnly;
  }

  if (isPastDate || isBeyondMaxDate || isBeyondMinDate) {
    console.warn("Invalid date selected:", selectedDate, {
      isPastDate,
      isBeyondMaxDate,
      isBeyondMinDate,
      maxDate: config.maxDate,
      minDate: config.minDate,
    });
    return; // Don't process invalid date selections
  }

  if (!state.checkInDate) {
    // First selection - always check-in date
    state.checkInDate = selectedDate;
    state.checkOutDate = undefined;
    state.isSelectingCheckOut = true;
    // Check-in date selected
  } else if (!state.checkOutDate && state.isSelectingCheckOut) {
    // Second selection - check-out date
    if (selectedDate <= state.checkInDate) {
      // Invalid selection - check-out must be after check-in
      showDateValidationError(selector, config, "checkout_after_checkin");
      return; // Don't update the selection
    } else {
      // Valid check-out selection
      state.checkOutDate = selectedDate;
      state.isSelectingCheckOut = false;
      // Check-out date selected
      // Don't auto-close calendar - let user review their selection
    }
  } else {
    // Both dates already selected, reset to new check-in
    state.checkInDate = selectedDate;
    state.checkOutDate = undefined;
    state.isSelectingCheckOut = true;
    // Reset both dates, start over with new check-in
  }

  // Update display immediately for user feedback
  updateDateDisplay(selector, state, config);

  // Update calendar selection styling without full re-render
  updateCalendarSelection(selector, state);

  // Add or update Done button when both dates are selected
  updateCalendarActions(selector, state, config);
}

function updateCalendarSelection(
  selector: HTMLElement,
  state: WidgetState
): void {
  const calendar = selector.querySelector(".calendar-container") as HTMLElement;
  if (!calendar) return;

  // Remove all previous selection classes
  const allDays = calendar.querySelectorAll(".calendar-day");
  allDays.forEach((day) => {
    day.classList.remove("selected", "check-in", "check-out", "in-range");
  });

  // Add new selection classes
  allDays.forEach((day) => {
    const dayElement = day as HTMLElement;
    const dateStr = dayElement.getAttribute("data-date");
    if (!dateStr) return;

    const parts = dateStr.split("-");
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const dayNum = parseInt(parts[2]);
    const dayDate = new Date(year, month, dayNum, 12, 0, 0, 0);

    // Use date string comparison to avoid timezone issues
    const checkInDateStr = state.checkInDate
      ? `${state.checkInDate.getFullYear()}-${String(
        state.checkInDate.getMonth() + 1
      ).padStart(2, "0")}-${String(state.checkInDate.getDate()).padStart(
        2,
        "0"
      )}`
      : null;
    const checkOutDateStr = state.checkOutDate
      ? `${state.checkOutDate.getFullYear()}-${String(
        state.checkOutDate.getMonth() + 1
      ).padStart(2, "0")}-${String(state.checkOutDate.getDate()).padStart(
        2,
        "0"
      )}`
      : null;

    // Check if this date is the check-in date
    if (checkInDateStr && dateStr === checkInDateStr) {
      dayElement.classList.add("selected", "check-in");
    }

    // Check if this date is the check-out date
    if (checkOutDateStr && dateStr === checkOutDateStr) {
      dayElement.classList.add("selected", "check-out");
    }

    // Check if this date is in the range between check-in and check-out
    if (
      checkInDateStr &&
      checkOutDateStr &&
      dateStr > checkInDateStr &&
      dateStr < checkOutDateStr
    ) {
      dayElement.classList.add("in-range");
    }
  });
}

function updateCalendarActions(
  selector: HTMLElement,
  state: WidgetState,
  config: WidgetConfig
): void {
  const calendar = selector.querySelector(".calendar-container") as HTMLElement;
  let actionsContainer = calendar.querySelector(
    ".calendar-actions"
  ) as HTMLElement;
  let infoContainer = calendar.querySelector(".calendar-info") as HTMLElement;

  // Update info section
  if (!infoContainer) {
    infoContainer = document.createElement("div");
    infoContainer.className = "calendar-info";

    // Insert before the calendar grid
    const calendarGrid = calendar.querySelector(".calendar-grid");
    if (calendarGrid) {
      calendar.insertBefore(infoContainer, calendarGrid);
    } else {
      calendar.appendChild(infoContainer);
    }
  }

  // Update info text based on state
  if (!state.checkInDate) {
    infoContainer.innerHTML = `<small class="calendar-help-text">${t(
      "calendar.select_checkin",
      config.locale
    )}</small>`;
  } else if (!state.checkOutDate && state.isSelectingCheckOut) {
    infoContainer.innerHTML = `<small class="calendar-help-text">${t(
      "calendar.select_checkout",
      config.locale
    )}</small>`;
  } else if (state.checkInDate && state.checkOutDate) {
    const nights = Math.ceil(
      (state.checkOutDate.getTime() - state.checkInDate.getTime()) /
      (1000 * 60 * 60 * 24)
    );
    const nightText =
      nights === 1
        ? t("calendar.night_selected", config.locale)
        : t("calendar.nights_selected", config.locale);
    infoContainer.innerHTML = `<small class="calendar-help-text">✓ ${nights} ${nightText}</small>`;
  }

  if (state.checkInDate && state.checkOutDate) {
    // Both dates selected - show Done button
    if (!actionsContainer) {
      actionsContainer = document.createElement("div");
      actionsContainer.className = "calendar-actions";
      calendar.appendChild(actionsContainer);
    }

    actionsContainer.innerHTML = `
      <button type="button" class="calendar-done-btn">
        ${t("button.done", config.locale)}
      </button>
    `;

    // Add event listener for Done button
    const doneBtn = actionsContainer.querySelector(
      ".calendar-done-btn"
    ) as HTMLButtonElement;
    doneBtn.addEventListener("click", () => {
      const dropdown = selector.querySelector(".field-dropdown") as HTMLElement;
      const trigger = selector.querySelector(
        ".field-trigger"
      ) as HTMLButtonElement;

      dropdown.style.display = "none";
      trigger.setAttribute("aria-expanded", "false");

      // Reset calendar selection state
      state.isSelectingCheckOut = false;

      // Focus next field (occupancy)
      const occupancySelector = selector
        .closest(".widget-search-container")
        ?.querySelector(
          ".occupancy-selector .field-trigger"
        ) as HTMLButtonElement;
      if (occupancySelector) {
        occupancySelector.focus();
      }
    });
  } else if (actionsContainer) {
    // Remove actions container if dates aren't both selected
    actionsContainer.remove();
  }
}

function handleCounterChange(
  selector: HTMLElement,
  config: WidgetConfig,
  state: WidgetState,
  roomIndex: number,
  type: "adults" | "children",
  isIncrease: boolean
): void {
  const room = state.rooms[roomIndex];
  const delta = isIncrease ? 1 : -1;

  if (type === "adults") {
    const newValue = room.adults + delta;
    if (newValue >= 1 && newValue <= config.maxAdults) {
      // Check total guests limit (adults + children)
      const totalGuests = newValue + room.children;
      if (totalGuests <= config.maxAdults + config.maxChildren) {
        room.adults = newValue;
      } else {
        showGuestLimitError(selector, config);
        return;
      }
    }
  } else {
    const newValue = room.children + delta;
    if (newValue >= 0 && newValue <= config.maxChildren) {
      // Check total guests limit (adults + children)
      const totalGuests = room.adults + newValue;
      if (totalGuests <= config.maxAdults + config.maxChildren) {
        // Update children count
        room.children = newValue;

        // Adjust childAges array
        if (newValue > room.childAges.length) {
          // Add default ages for new children
          while (room.childAges.length < newValue) {
            room.childAges.push(config.minChildAge);
          }
        } else {
          // Remove excess ages
          room.childAges = room.childAges.slice(0, newValue);
        }
      } else {
        showGuestLimitError(selector, config);
        return;
      }
    }
  }

  // Re-render rooms
  const roomsContainer = selector.querySelector(
    ".rooms-container"
  ) as HTMLElement;
  renderOccupancyRooms(roomsContainer, config, state.rooms);

  updateOccupancyDisplay(selector, state, config);
}

function updateDateDisplay(
  selector: HTMLElement,
  state: WidgetState,
  config: WidgetConfig
): void {
  const trigger = selector.querySelector(".field-trigger") as HTMLElement;
  const valueElement = trigger.querySelector(".field-value") as HTMLElement;

  if (state.checkInDate && state.checkOutDate) {
    const checkIn = formatDate(state.checkInDate, "compact");
    const checkOut = formatDate(state.checkOutDate, "compact");
    valueElement.textContent = `${checkIn} — ${checkOut}`; // Removed nights count
  } else if (state.checkInDate && state.isSelectingCheckOut) {
    valueElement.textContent = `${formatDate(
      state.checkInDate,
      "compact"
    )} — ${t("date.choose_checkout", config.locale)}`;
  } else if (state.checkInDate) {
    valueElement.textContent = `${formatDate(
      state.checkInDate,
      "compact"
    )} — ${t("date.choose_checkout", config.locale)}`;
  } else {
    valueElement.textContent = t("date.checkin_checkout", config.locale);
  }
}

function updateOccupancyDisplay(
  selector: HTMLElement,
  state: WidgetState,
  config: WidgetConfig
): void {
  const trigger = selector.querySelector(".field-trigger") as HTMLElement;
  const valueElement = trigger.querySelector(".field-value") as HTMLElement;

  const totalAdults = state.rooms.reduce((sum, room) => sum + room.adults, 0);
  const totalChildren = state.rooms.reduce(
    (sum, room) => sum + room.children,
    0
  );
  const roomCount = state.rooms.length;

  let text = `${totalAdults} ${t(
    "occupancy.adults",
    config.locale
  ).toLowerCase()}`;
  if (totalChildren > 0) {
    text += `, ${totalChildren} ${t(
      "occupancy.children",
      config.locale
    ).toLowerCase()}`;
  }
  text += ` · ${roomCount} ${roomCount > 1
      ? t("occupancy.rooms", config.locale)
      : t("occupancy.room", config.locale)
    }`;

  valueElement.textContent = text;
}

function filterHotels(hotelsList: HTMLElement, searchTerm: string, config?: any): void {
  const options = hotelsList.querySelectorAll(".hotel-option");
  const groups = hotelsList.querySelectorAll(".hotel-group-header");

  searchTerm = searchTerm.toLowerCase().trim();

  // Clear previous highlights
  options.forEach((option) => {
    const hotelName = option.querySelector(".hotel-name");
    if (hotelName) {
      hotelName.innerHTML = hotelName.textContent || "";
    }
  });

  options.forEach((option) => {
    const hotelNameElement = option.querySelector(".hotel-name");
    const hotelName = hotelNameElement?.textContent?.toLowerCase() || "";

    let shouldShow = false;

    if (searchTerm === "") {
      shouldShow = true;
    } else {
      // Enhanced search: check name, location, and city
      const hotelData = option.getAttribute("data-hotel-id");
      const location = option.closest(".hotel-group-header")?.textContent?.toLowerCase() || "";

      // Fuzzy search - check if search term appears in sequence
      shouldShow = fuzzyMatch(hotelName, searchTerm) ||
        fuzzyMatch(location, searchTerm) ||
        hotelName.includes(searchTerm);

      // Highlight matching text
      if (shouldShow && searchTerm) {
        highlightSearchTerm(hotelNameElement as HTMLElement, searchTerm);
      }
    }

    (option as HTMLElement).style.display = shouldShow ? "block" : "none";

    // Remove focus from hidden options
    if (!shouldShow && option === document.activeElement) {
      (option as HTMLElement).blur();
    }
  });

  // Hide/show group headers based on whether they have visible hotels
  groups.forEach((group) => {
    const nextElements = [];
    let nextSibling = group.nextElementSibling;

    while (
      nextSibling &&
      !nextSibling.classList.contains("hotel-group-header")
    ) {
      if (nextSibling.classList.contains("hotel-option")) {
        nextElements.push(nextSibling);
      }
      nextSibling = nextSibling.nextElementSibling;
    }

    const hasVisibleHotels = nextElements.some(
      (el) => (el as HTMLElement).style.display !== "none"
    );
    (group as HTMLElement).style.display = hasVisibleHotels ? "block" : "none";
  });

  // Show "No results" message if needed
  const visibleOptions = Array.from(options).filter(
    (option) => (option as HTMLElement).style.display !== "none"
  );

  let noResultsMessage = hotelsList.querySelector(".no-results") as HTMLElement;
  if (visibleOptions.length === 0 && searchTerm) {
    if (!noResultsMessage) {
      noResultsMessage = document.createElement("div");
      noResultsMessage.className = "no-results";
      noResultsMessage.textContent = t("hotel.no_results", config?.locale || "en");
      hotelsList.appendChild(noResultsMessage);
    }
    (noResultsMessage as HTMLElement).style.display = "block";
  } else if (noResultsMessage) {
    (noResultsMessage as HTMLElement).style.display = "none";
  }
}

function fuzzyMatch(text: string, searchTerm: string): boolean {
  if (!searchTerm) return true;

  let textIndex = 0;
  let searchIndex = 0;

  while (textIndex < text.length && searchIndex < searchTerm.length) {
    if (text[textIndex] === searchTerm[searchIndex]) {
      searchIndex++;
    }
    textIndex++;
  }

  return searchIndex === searchTerm.length;
}

function highlightSearchTerm(element: HTMLElement, searchTerm: string): void {
  const text = element.textContent || "";
  const regex = new RegExp(`(${searchTerm})`, "gi");
  const highlightedText = text.replace(regex, '<mark class="search-highlight">$1</mark>');
  element.innerHTML = highlightedText;
}

function handleHotelSearchKeyboard(
  e: KeyboardEvent,
  hotelsList: HTMLElement,
  searchInput: HTMLInputElement
): void {
  const options = Array.from(hotelsList.querySelectorAll(".hotel-option:not([style*='display: none'])")) as HTMLElement[];
  const currentFocused = hotelsList.querySelector(".hotel-option:focus") as HTMLElement;
  const currentIndex = currentFocused ? options.indexOf(currentFocused) : -1;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
      if (options[nextIndex]) {
        options[nextIndex].focus();
        options[nextIndex].scrollIntoView({ block: "nearest" });
      }
      break;

    case "ArrowUp":
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
      if (options[prevIndex]) {
        options[prevIndex].focus();
        options[prevIndex].scrollIntoView({ block: "nearest" });
      }
      break;

    case "Enter":
      e.preventDefault();
      if (currentFocused) {
        currentFocused.click();
      }
      break;

    case "Escape":
      e.preventDefault();
      searchInput.blur();
      const dropdown = hotelsList.closest(".field-dropdown") as HTMLElement;
      const trigger = dropdown?.closest(".hotel-selector")?.querySelector(".field-trigger") as HTMLElement;
      if (dropdown && trigger) {
        dropdown.style.display = "none";
        trigger.setAttribute("aria-expanded", "false");
      }
      break;
  }
}

function closeAllDropdowns(
  container: HTMLElement,
  exceptDateCalendar: boolean = false
): void {
  const dropdowns = container.querySelectorAll(".field-dropdown");
  const triggers = container.querySelectorAll(".field-trigger");

  dropdowns.forEach((dropdown) => {
    const dropdownElement = dropdown as HTMLElement;
    // Don't close date dropdown if it's in date selection mode and exceptDateCalendar is true
    if (
      exceptDateCalendar &&
      dropdownElement.classList.contains("date-dropdown")
    ) {
      const dateSelector = dropdownElement.closest(".date-selector");
      if (dateSelector) {
        // Check if we're currently selecting dates
        const isDateSelectorActive = dropdownElement.style.display !== "none";
        if (isDateSelectorActive) {
          return; // Skip closing this dropdown
        }
      }
    }
    dropdownElement.style.display = "none";
  });

  triggers.forEach((trigger) => {
    const dropdown = trigger.parentElement?.querySelector(
      ".field-dropdown"
    ) as HTMLElement;
    // Don't update aria-expanded for date selector if we're not closing it
    if (exceptDateCalendar && dropdown?.classList.contains("date-dropdown")) {
      const dateSelector = dropdown.closest(".date-selector");
      if (dateSelector && dropdown.style.display !== "none") {
        return; // Skip updating aria-expanded
      }
    }
    trigger.setAttribute("aria-expanded", "false");
  });
}

function showDateValidationError(selector: HTMLElement, config: WidgetConfig, errorType: string): void {
  const calendar = selector.querySelector(".calendar-container") as HTMLElement;
  if (!calendar) return;

  // Remove existing error messages
  const existingError = calendar.querySelector(".date-validation-error");
  if (existingError) {
    existingError.remove();
  }

  // Create error message
  const errorElement = document.createElement("div");
  errorElement.className = "date-validation-error";
  errorElement.textContent = t(`validation.${errorType}`, config.locale);

  // Insert error message after calendar info
  const calendarInfo = calendar.querySelector(".calendar-info");
  if (calendarInfo) {
    calendarInfo.insertAdjacentElement("afterend", errorElement);
  } else {
    // Insert at the beginning of calendar
    const calendarGrid = calendar.querySelector(".calendar-grid");
    if (calendarGrid) {
      calendar.insertBefore(errorElement, calendarGrid);
    }
  }

  // Auto-remove error after 3 seconds
  setTimeout(() => {
    if (errorElement.parentNode) {
      errorElement.remove();
    }
  }, 3000);
}

function showGuestLimitError(selector: HTMLElement, config: WidgetConfig): void {
  const roomsContainer = selector.querySelector(".rooms-container") as HTMLElement;
  if (!roomsContainer) return;

  // Remove existing error messages
  const existingError = roomsContainer.querySelector(".guest-limit-error");
  if (existingError) {
    existingError.remove();
  }

  // Create error message
  const errorElement = document.createElement("div");
  errorElement.className = "guest-limit-error";
  errorElement.textContent = t("validation.max_guests_exceeded", config.locale);

  // Insert error message at the top of rooms container
  roomsContainer.insertBefore(errorElement, roomsContainer.firstChild);

  // Auto-remove error after 3 seconds
  setTimeout(() => {
    if (errorElement.parentNode) {
      errorElement.remove();
    }
  }, 3000);
}

function showLoadingState(): void {
  // Find the search button and show loading state
  const searchButtons = document.querySelectorAll(".search-btn");
  searchButtons.forEach(button => {
    const btn = button as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = t("search.loading", "en");
    btn.classList.add("loading");
  });
}

function hideLoadingState(): void {
  // Find the search button and hide loading state
  const searchButtons = document.querySelectorAll(".search-btn");
  searchButtons.forEach(button => {
    const btn = button as HTMLButtonElement;
    btn.disabled = false;
    btn.textContent = t("search.button", "en");
    btn.classList.remove("loading");
  });
}

function showAvailabilityError(message: string): void {
  // Create a global error message
  const errorElement = document.createElement("div");
  errorElement.className = "availability-error";
  errorElement.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #dc3545;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 10002;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideDown 0.3s ease-out;
  `;
  errorElement.textContent = message;

  document.body.appendChild(errorElement);

  // Auto-remove error after 5 seconds
  setTimeout(() => {
    if (errorElement.parentNode) {
      errorElement.style.animation = "slideUp 0.3s ease-out";
      setTimeout(() => {
        if (errorElement.parentNode) {
          errorElement.remove();
        }
      }, 300);
    }
  }, 5000);
}

async function handleSearch(config: WidgetConfig, state: WidgetState): Promise<void> {
  // Validate required fields
  if (!state.checkInDate || !state.checkOutDate) {
    alert(t("alert.dates", config.locale));
    return;
  }

  // Validate date range
  if (state.checkOutDate <= state.checkInDate) {
    alert(t("validation.checkout_after_checkin", config.locale));
    return;
  }

  if (config.showHotelSelector && !state.selectedHotel) {
    alert(t("alert.hotel", config.locale));
    return;
  }

  // Build redirect URL according to the specified format
  // https://www.miweb.com/buscar?hotel=12345&entry=2024-08-10&exit=2024-08-12&adults=2&promo=XYZ
  const params = new URLSearchParams();

  // Add hotel ID if selected
  if (state.selectedHotel && state.selectedHotel !== "all-hotels") {
    params.append("hotel", state.selectedHotel);
  }

  // Add dates in YYYY-MM-DD format
  params.append("entry", formatDate(state.checkInDate, "yyyy-MM-dd"));
  params.append("exit", formatDate(state.checkOutDate, "yyyy-MM-dd"));

  // Add total adults count
  const totalAdults = state.rooms.reduce((sum, room) => sum + room.adults, 0);
  params.append("adults", totalAdults.toString());

  // Add promotional code if provided
  if (state.promoCode) {
    params.append("promo", state.promoCode);
  }

  // Add any additional parameters from updateParams event
  if (state.additionalParams) {
    Object.entries(state.additionalParams).forEach(([key, value]) => {
      params.append(key, value);
    });
  }

  // Build the final URL
  let finalUrl = "";

  // Use external URL if configured
  if (config.externalUrl) {
    finalUrl = config.externalUrl;

    // Add external URL parameters if provided
    if (config.externalUrlParams) {
      Object.entries(config.externalUrlParams).forEach(([key, value]) => {
        params.append(key, value);
      });
    }

    // Add the search parameters
    finalUrl += `?${params.toString()}`;
  } else if (config.baseUrl) {
    // Use the baseUrl from config
    finalUrl = `${config.baseUrl}?${params.toString()}`;
  } else {
    // Fallback to the original logic if baseUrl is not provided
    if (!state.selectedHotel || state.selectedHotel === "all-hotels") {
      finalUrl = `${config.urlChain}?${params.toString()}`;
    } else {
      finalUrl = `${config.urlHotel}/${state.selectedHotel}?${params.toString()}`;
    }
  }

  // Optional: Call availability API before redirecting
  if (config.apiUrl) {
    try {
      const availabilityParams = new URLSearchParams();
      availabilityParams.append("hotel_id", state.selectedHotel || "all-hotels");
      availabilityParams.append("fecha_inicio", formatDate(state.checkInDate, "yyyy-MM-dd"));
      availabilityParams.append("fecha_fin", formatDate(state.checkOutDate, "yyyy-MM-dd"));

      const availabilityUrl = `${config.apiUrl}/api/disponibilidad?${availabilityParams.toString()}`;

      // Show loading state
      showLoadingState();

      const response = await fetch(availabilityUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const availabilityData = await response.json();

      // Hide loading state
      hideLoadingState();

      // Check availability
      if (availabilityData.available === false) {
        showAvailabilityError(availabilityData.message || t("availability.not_available", config.locale));
        return;
      }

      // If available, proceed with redirect
      window.open(finalUrl, "_blank");

    } catch (error) {
      console.error("Availability check failed:", error);
      hideLoadingState();

      // Show error but still allow redirect
      showAvailabilityError(t("availability.check_failed", config.locale));

      // Still redirect even if availability check fails
      setTimeout(() => {
        window.open(finalUrl, "_blank");
      }, 2000);
    }
  } else {
    // No API URL configured, redirect directly
    window.open(finalUrl, "_blank");
  }
}
