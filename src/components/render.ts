import { WidgetConfig, getHotelById, getHotelGroups } from "../types/config";
import { formatPrice, getWeekdayNames, t } from "../utils/utils";

export function renderWidget(
  container: HTMLElement,
  config: WidgetConfig
): void {
  const windowWidth = window.innerWidth;
  const isMobileView = windowWidth < 1024; // Force column layout below 1024px

  // Debug logging
  console.log("Widget render:", {
    containerID: container.id,
    originalLayout: config.layout,
    windowWidth,
    isMobileView,
  });
  // Clear existing content
  container.innerHTML = "";

  // Determine effective layout based on screen size and config
  let effectiveLayout = config.layout;

  // Force column layout on screens below 1024px for ALL layout types
  if (isMobileView) {
    effectiveLayout = "column";
    console.log(
      "Forced column layout for screen below 1024px:",
      effectiveLayout
    );
  }

  // Add widget classes with responsive behavior
  container.className = `widget-search-container ${effectiveLayout} ${config.theme}`;

  // Add responsive data attribute for CSS targeting
  container.setAttribute("data-responsive-layout", effectiveLayout);
  container.setAttribute("data-original-layout", config.layout);

  console.log("Applied CSS classes:", container.className);

  // Add modal functionality - convert widget to modal when clicked
  container.addEventListener("click", (e) => {
    // Don't trigger modal if clicking on dropdowns, buttons, or form elements
    if ((e.target as HTMLElement).closest(".field-dropdown") || 
        (e.target as HTMLElement).closest(".search-btn") ||
        (e.target as HTMLElement).closest(".checkin-online-btn") ||
        (e.target as HTMLElement).closest("input") ||
        (e.target as HTMLElement).closest("select") ||
        (e.target as HTMLElement).closest("button")) {
      return;
    }
    convertToModal(container, config);
  });

  // Always render the full widget, but adapt layout for mobile
  renderResponsiveWidget(container, config, effectiveLayout, isMobileView);
}

export function renderModalWidget(
  container: HTMLElement,
  config: WidgetConfig
): void {
  // Clear existing content
  container.innerHTML = "";

  // Force column layout for modal
  const effectiveLayout = "column";

  // Add widget classes for modal
  container.className = `widget-search-container ${effectiveLayout} ${config.theme}`;

  // Always render the full widget form in modal (never mobile button)
  renderResponsiveWidget(container, config, effectiveLayout, false);
}

function renderResponsiveWidget(
  container: HTMLElement,
  config: WidgetConfig,
  layout: string,
  isMobileView: boolean
): void {
  const widget = document.createElement("div");
  widget.className = "widget-search";

  // For mobile/tablet, render a simple search button that opens modal
  if (isMobileView) {
    const mobileButton = document.createElement("button");
    mobileButton.className = "widget-search-mobile-trigger";
    mobileButton.type = "button";
    mobileButton.innerHTML = `
      <span class="search-icon">🔍</span>
      <span>${t("search.button", config.locale)}</span>
    `;
    mobileButton.setAttribute("aria-label", t("search.button", config.locale));
    
    widget.appendChild(mobileButton);
    container.appendChild(widget);
    return;
  }

  // Desktop version - render full form
  const form = document.createElement("form");
  form.className = "widget-form";

  const fieldsContainer = document.createElement("div");
  fieldsContainer.className = `widget-fields ${layout}`;

  // Add mobile class for additional mobile styling
  if (isMobileView) {
    fieldsContainer.classList.add("mobile-responsive");
  }

  // Hotel selector (only for chain type)
  if (config.showHotelSelector && config.type === "chain") {
    fieldsContainer.appendChild(renderHotelSelector(config));
  }

  // Date selector
  fieldsContainer.appendChild(renderDateSelector(config));

  // Occupancy selector
  fieldsContainer.appendChild(renderOccupancySelector(config));

  // Promo code (if enabled)
  if (config.showPromoCode) {
    fieldsContainer.appendChild(renderPromoCodeInput(config));
  }

  // Search button
  fieldsContainer.appendChild(renderSearchButton(config));

  form.appendChild(fieldsContainer);
  widget.appendChild(form);

  // Check-in online button (if enabled)
  if (config.showCheckinOnline && config.checkinOnlineUrl) {
    widget.appendChild(renderCheckinOnlineButton(config));
  }

  // Add live region for announcements
  const liveRegion = document.createElement("div");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  liveRegion.className = "sr-only";
  liveRegion.id = "widget-announcements";
  widget.appendChild(liveRegion);

  container.appendChild(widget);
}

function renderHotelSelector(config: WidgetConfig): HTMLElement {
  const field = document.createElement("div");
  field.className = "widget-field hotel-selector";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "field-trigger";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-label", t("hotel.select", config.locale));

  const selectedHotel = config.hotel ? getHotelById(config.hotel) : null;

  trigger.innerHTML = `
    <div class="field-icon">🏨</div>
    <div class="field-content">
      <small class="field-label">${t("field.where", config.locale)}</small>
      <span class="field-value">${
        selectedHotel ? selectedHotel.name : t("hotel.select", config.locale)
      }</span>
    </div>
    <div class="field-arrow">▼</div>
  `;

  const dropdown = document.createElement("div");
  dropdown.className = "field-dropdown hotel-dropdown";
  dropdown.setAttribute("role", "listbox");
  dropdown.setAttribute("aria-label", t("hotel.all", config.locale));
  dropdown.setAttribute("aria-multiselectable", "false");
  dropdown.style.display = "none";

  // Search input
  const searchContainer = document.createElement("div");
  searchContainer.className = "dropdown-search";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = t("hotel.search", config.locale);
  searchInput.className = "search-input";

  searchContainer.appendChild(searchInput);
  dropdown.appendChild(searchContainer);

  // Hotels list
  const hotelsList = document.createElement("div");
  hotelsList.className = "hotels-list";

  // Add "All Hotels" option
  const allHotelsOption = document.createElement("div");
  allHotelsOption.className = "hotel-option";
  allHotelsOption.setAttribute("data-hotel-id", "all-hotels");
  allHotelsOption.setAttribute("role", "option");
  allHotelsOption.setAttribute(
    "aria-selected",
    config.hotel === "all-hotels" ? "true" : "false"
  );
  allHotelsOption.setAttribute("tabindex", "0");
  allHotelsOption.innerHTML = `<span class="hotel-name">${t(
    "hotel.all",
    config.locale
  )}</span>`;
  hotelsList.appendChild(allHotelsOption);

  // Group hotels by location
  const hotelGroups = getHotelGroups();
  hotelGroups.forEach((group) => {
    const groupHeader = document.createElement("div");
    groupHeader.className = "hotel-group-header";
    groupHeader.textContent = group.location;
    hotelsList.appendChild(groupHeader);

    group.hotels.forEach((hotel) => {
      const option = document.createElement("div");
      option.className = "hotel-option";
      option.setAttribute("data-hotel-id", hotel.id);
      option.setAttribute("role", "option");
      option.setAttribute(
        "aria-selected",
        hotel.id === config.hotel ? "true" : "false"
      );
      option.setAttribute("tabindex", "0");
      option.innerHTML = `<span class="hotel-name">${hotel.name}</span>`;

      if (hotel.id === config.hotel) {
        option.classList.add("selected");
      }

      hotelsList.appendChild(option);
    });
  });

  dropdown.appendChild(hotelsList);

  field.appendChild(trigger);
  field.appendChild(dropdown);

  return field;
}

function renderDateSelector(config: WidgetConfig): HTMLElement {
  const field = document.createElement("div");
  field.className = "widget-field date-selector";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "field-trigger";
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-label", t("date.checkin_checkout", config.locale));
  trigger.setAttribute("readonly", "true");
  trigger.style.cursor = "pointer";

  trigger.innerHTML = `
    <div class="field-icon">📅</div>
    <div class="field-content">
      <small class="field-label">${t("field.when", config.locale)}</small>
      <span class="field-value">${t(
        "date.checkin_checkout",
        config.locale
      )}</span>
    </div>
    <div class="field-arrow">▼</div>
  `;

  const dropdown = document.createElement("div");
  dropdown.className = "field-dropdown date-dropdown";
  dropdown.setAttribute("role", "dialog");
  dropdown.setAttribute(
    "aria-label",
    t("date.checkin_checkout", config.locale)
  );
  dropdown.setAttribute("aria-modal", "false");
  dropdown.style.display = "none";

  // Check if we're on mobile/tablet to add sheet header
  const isMobileView = window.innerWidth < 1024;

  if (isMobileView) {
    // Create sheet header for mobile/tablet
    const sheetHeader = document.createElement("div");
    sheetHeader.className = "calendar-sheet-header";

    const sheetTitle = document.createElement("h2");
    sheetTitle.className = "calendar-sheet-title";
    sheetTitle.textContent = "When";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "calendar-sheet-close";
    closeButton.innerHTML = "×";
    closeButton.setAttribute("aria-label", "Close calendar");

    sheetHeader.appendChild(sheetTitle);
    sheetHeader.appendChild(closeButton);
    dropdown.appendChild(sheetHeader);

    // Create content wrapper
    const sheetContent = document.createElement("div");
    sheetContent.className = "calendar-sheet-content";

      // Quick date selection buttons for mobile
  const quickDatesContainer = document.createElement("div");
  quickDatesContainer.className = "quick-dates-container";
  
  const quickDatesTitle = document.createElement("h3");
  quickDatesTitle.className = "quick-dates-title";
  quickDatesTitle.textContent = t("calendar.quick_dates", config.locale);
  quickDatesContainer.appendChild(quickDatesTitle);
  
  const quickDatesButtons = document.createElement("div");
  quickDatesButtons.className = "quick-dates-buttons";
  
  // Add quick date options
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);
  
  const quickDateOptions = [
    { label: t("calendar.today", config.locale), date: today },
    { label: t("calendar.tomorrow", config.locale), date: tomorrow },
    { label: t("calendar.next_week", config.locale), date: nextWeek },
    { label: t("calendar.next_month", config.locale), date: nextMonth }
  ];
  
  quickDateOptions.forEach(option => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quick-date-btn";
    button.textContent = option.label;
    button.setAttribute("data-date", option.date.toISOString().split('T')[0]);
    quickDatesButtons.appendChild(button);
  });
  
  quickDatesContainer.appendChild(quickDatesButtons);
  sheetContent.appendChild(quickDatesContainer);

  // Calendar container goes inside content wrapper
  const calendar = document.createElement("div");
  calendar.className = "calendar-container";
  sheetContent.appendChild(calendar);

  dropdown.appendChild(sheetContent);
  } else {
    // Desktop: Just add calendar container directly
    const calendar = document.createElement("div");
    calendar.className = "calendar-container";
    dropdown.appendChild(calendar);
  }

  field.appendChild(trigger);
  field.appendChild(dropdown);

  return field;
}

function renderOccupancySelector(config: WidgetConfig): HTMLElement {
  const field = document.createElement("div");
  field.className = "widget-field occupancy-selector";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "field-trigger";
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute(
    "aria-label",
    `${config.defaultAdults} ${t(
      "occupancy.adults",
      config.locale
    ).toLowerCase()}, ${config.defaultRooms} ${t(
      "occupancy.room",
      config.locale
    )}`
  );

  trigger.innerHTML = `
    <div class="field-icon">👥</div>
    <div class="field-content">
      <small class="field-label">${t("field.who", config.locale)}</small>
      <span class="field-value">${config.defaultAdults} ${t(
    "occupancy.adults",
    config.locale
  ).toLowerCase()} · ${config.defaultRooms} ${t(
    "occupancy.room",
    config.locale
  )}</span>
    </div>
    <div class="field-arrow">▼</div>
  `;

  const dropdown = document.createElement("div");
  dropdown.className = "field-dropdown occupancy-dropdown";
  dropdown.style.display = "none";

  // Check if we're on mobile/tablet to add sheet header
  const isMobileView = window.innerWidth < 1024;

  if (isMobileView) {
    // Create sheet header for mobile/tablet
    const sheetHeader = document.createElement("div");
    sheetHeader.className = "occupancy-sheet-header";

    const sheetTitle = document.createElement("h2");
    sheetTitle.className = "occupancy-sheet-title";
    sheetTitle.textContent = t("field.who", config.locale);

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "occupancy-sheet-close";
    closeButton.innerHTML = "×";
    closeButton.setAttribute("aria-label", "Close occupancy selector");

    sheetHeader.appendChild(sheetTitle);
    sheetHeader.appendChild(closeButton);
    dropdown.appendChild(sheetHeader);

    // Create content wrapper
    const sheetContent = document.createElement("div");
    sheetContent.className = "occupancy-sheet-content";

    // Rooms container goes inside content wrapper
    const roomsContainer = document.createElement("div");
    roomsContainer.className = "rooms-container";
    sheetContent.appendChild(roomsContainer);

    // Actions container for buttons
    const actionsContainer = document.createElement("div");
    actionsContainer.className = "occupancy-actions";

    // Add room button
    const addRoomBtn = document.createElement("button");
    addRoomBtn.type = "button";
    addRoomBtn.className = "add-room-btn";
    addRoomBtn.textContent = t("occupancy.add_room", config.locale);
    actionsContainer.appendChild(addRoomBtn);

    // Confirm button
    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "occupancy-confirm-btn";
    confirmBtn.textContent = t("button.done", config.locale);
    actionsContainer.appendChild(confirmBtn);

    dropdown.appendChild(sheetContent);
    dropdown.appendChild(actionsContainer);
  } else {
    // Desktop: Just add rooms container and button directly
    const roomsContainer = document.createElement("div");
    roomsContainer.className = "rooms-container";
    dropdown.appendChild(roomsContainer);

    // Add room button
    const addRoomBtn = document.createElement("button");
    addRoomBtn.type = "button";
    addRoomBtn.className = "add-room-btn";
    addRoomBtn.textContent = t("occupancy.add_room", config.locale);
    dropdown.appendChild(addRoomBtn);
  }

  field.appendChild(trigger);
  field.appendChild(dropdown);

  return field;
}

function renderPromoCodeInput(config: WidgetConfig): HTMLElement {
  const field = document.createElement("div");
  field.className = "widget-field promo-code";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "promo-input";
  input.placeholder = t("search.promo", config.locale);
  input.setAttribute("aria-label", t("search.promo", config.locale));

  field.appendChild(input);

  return field;
}

function renderSearchButton(config: WidgetConfig): HTMLElement {
  const field = document.createElement("div");
  field.className = "widget-field search-button";

  const button = document.createElement("button");
  button.type = "submit";
  button.className = "search-btn";
  button.textContent = t("search.button", config.locale);
  button.setAttribute("aria-label", t("search.button", config.locale));

  field.appendChild(button);

  return field;
}

function renderCheckinOnlineButton(config: WidgetConfig): HTMLElement {
  const container = document.createElement("div");
  container.className = "checkin-online-container";

  const button = document.createElement("a");
  button.href = config.checkinOnlineUrl || "#";
  button.className = "checkin-online-btn";
  button.textContent = config.checkinOnlineText || t("checkin.online", config.locale);
  button.setAttribute("aria-label", config.checkinOnlineText || t("checkin.online", config.locale));
  button.target = "_blank";
  button.rel = "noopener noreferrer";

  container.appendChild(button);

  return container;
}

export function renderCalendar(
  container: HTMLElement,
  config: WidgetConfig,
  selectedDates: { checkIn?: Date; checkOut?: Date } = {},
  currentMonth?: Date
): void {
  container.innerHTML = "";

  const today = new Date();
  const displayMonth = currentMonth || selectedDates.checkIn || today;
  
  // Set min date to today if not specified
  const minDate = config.minDate || today;
  // Set max date to 1 year from today if not specified
  const maxDate = config.maxDate || new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

  // Calendar header
  const header = document.createElement("div");
  header.className = "calendar-header";

  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.className = "calendar-nav prev";
  prevBtn.innerHTML = "‹";
  prevBtn.setAttribute("aria-label", "Previous month");
  prevBtn.setAttribute("tabindex", "0");

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "calendar-nav next";
  nextBtn.innerHTML = "›";
  nextBtn.setAttribute("aria-label", "Next month");
  nextBtn.setAttribute("tabindex", "0");

  const monthYear = document.createElement("h3");
  monthYear.className = "calendar-month-year";
  monthYear.textContent = displayMonth.toLocaleDateString(config.locale, {
    month: "long",
    year: "numeric",
  });

  header.appendChild(prevBtn);
  header.appendChild(monthYear);
  header.appendChild(nextBtn);
  container.appendChild(header);

  // Days of week
  const daysOfWeek = document.createElement("div");
  daysOfWeek.className = "calendar-days-header";

  const dayNames = getWeekdayNames(config.locale);
  dayNames.forEach((day) => {
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day-name";
    dayElement.textContent = day;
    daysOfWeek.appendChild(dayElement);
  });
  container.appendChild(daysOfWeek);

  // Calendar grid
  const grid = document.createElement("div");
  grid.className = "calendar-grid";
  grid.setAttribute("role", "grid");
  grid.setAttribute(
    "aria-label",
    `Calendar for ${displayMonth.toLocaleDateString(config.locale, {
      month: "long",
      year: "numeric",
    })}`
  );

  const firstDay = new Date(
    displayMonth.getFullYear(),
    displayMonth.getMonth(),
    1
  );

  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const dayElement = document.createElement("button");
    dayElement.type = "button";
    dayElement.className = "calendar-day";
    dayElement.textContent = date.getDate().toString();
    dayElement.setAttribute("role", "gridcell");
    dayElement.setAttribute("tabindex", "-1");

    // Use local date formatting to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const localDateString = `${year}-${month}-${day}`;
    dayElement.setAttribute("data-date", localDateString);

    // Add accessible date label
    const formattedDate = date.toLocaleDateString(config.locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    dayElement.setAttribute("aria-label", formattedDate);

    // Add classes for styling
    if (date.getMonth() !== displayMonth.getMonth()) {
      dayElement.classList.add("other-month");
    }

    // Check if date should be disabled (past dates or beyond date constraints)
    // Normalize dates to compare only date parts (ignore time)
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // Check if date is before min date or after max date
    const minDateOnly = new Date(
      minDate.getFullYear(),
      minDate.getMonth(),
      minDate.getDate()
    );
    const maxDateOnly = new Date(
      maxDate.getFullYear(),
      maxDate.getMonth(),
      maxDate.getDate()
    );
    
    let isPastDate = dateOnly < minDateOnly;
    let isFutureDate = dateOnly > maxDateOnly;

    if (isPastDate || isFutureDate) {
      dayElement.classList.add("disabled");
      dayElement.disabled = true;
    }

    // Check if this date is the check-in date
    if (
      selectedDates.checkIn &&
      date.toDateString() === selectedDates.checkIn.toDateString()
    ) {
      dayElement.classList.add("selected", "check-in");
    }

    // Check if this date is the check-out date
    if (
      selectedDates.checkOut &&
      date.toDateString() === selectedDates.checkOut.toDateString()
    ) {
      dayElement.classList.add("selected", "check-out");
    }

    // Add nights calculation popup for potential checkout dates
    if (selectedDates.checkIn && !selectedDates.checkOut && !isPastDate && !isFutureDate) {
      const nights = Math.ceil((date.getTime() - selectedDates.checkIn.getTime()) / (1000 * 60 * 60 * 24));
      if (nights > 0) {
        const nightsPopup = document.createElement("div");
        nightsPopup.className = "nights-popup";
        nightsPopup.textContent = `${nights} ${nights === 1 ? t("calendar.night", config.locale) : t("calendar.nights", config.locale)}`;
        dayElement.appendChild(nightsPopup);
      }
    }

    // Check if this date is in the range between check-in and check-out
    if (
      selectedDates.checkIn &&
      selectedDates.checkOut &&
      date > selectedDates.checkIn &&
      date < selectedDates.checkOut
    ) {
      dayElement.classList.add("in-range");
    }

    // Add price if available (mock data)
    const priceElement = document.createElement("span");
    priceElement.className = "day-price";

    // Only show price if hotel is selected (for chain type) or always for hotel type
    let shouldShowPrice =
      config.type === "hotel" ||
      !config.showPrice ||
      (config.type === "chain" &&
        config.hotel &&
        config.hotel !== "all-hotels");
    if (!config.showPrice) {
      shouldShowPrice = false;
    }
    if (shouldShowPrice && !isPastDate && !isFutureDate) {
      // Dynamic price calculation based on date and hotel
      const basePrice = 120;
      const weekendMultiplier = (date.getDay() === 0 || date.getDay() === 6) ? 1.3 : 1;
      const seasonalMultiplier = (date.getMonth() >= 5 && date.getMonth() <= 8) ? 1.5 : 1;
      const hotelMultiplier = config.hotel === "playa-garden-selection-hotel-spa" ? 1.2 : 1;
      const finalPrice = Math.round(basePrice * weekendMultiplier * seasonalMultiplier * hotelMultiplier);
      const formattedPrice = formatPrice(finalPrice, config.currency);
      priceElement.textContent = formattedPrice;
    } else {
      priceElement.textContent = "";
    }

    dayElement.appendChild(priceElement);

    grid.appendChild(dayElement);
  }

  container.appendChild(grid);
}

export function renderOccupancyRooms(
  container: HTMLElement,
  config: WidgetConfig,
  rooms: Array<{ adults: number; children: number; childAges: number[] }>
): void {
  container.innerHTML = "";

  rooms.forEach((room, index) => {
    const roomElement = document.createElement("div");
    roomElement.className = "room-config";

    const roomHeader = document.createElement("div");
    roomHeader.className = "room-header";

    const roomTitle = document.createElement("h4");
    roomTitle.textContent =
      t("occupancy.room", config.locale) + ` ${index + 1}`;
    roomHeader.appendChild(roomTitle);

    if (rooms.length > 1) {
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "remove-room-btn";
      removeBtn.textContent = t("occupancy.remove", config.locale);
      removeBtn.setAttribute("data-room-index", index.toString());
      roomHeader.appendChild(removeBtn);
    }

    roomElement.appendChild(roomHeader);

    // Adults counter
    const adultsCounter = createCounter(
      t("occupancy.adults", config.locale),
      room.adults,
      config.maxAdults,
      1
    );
    adultsCounter.setAttribute("data-room-index", index.toString());
    adultsCounter.setAttribute("data-type", "adults");
    roomElement.appendChild(adultsCounter);

    // Children counter
    const childrenCounter = createCounter(
      t("occupancy.children", config.locale),
      room.children,
      config.maxChildren,
      0
    );
    childrenCounter.setAttribute("data-room-index", index.toString());
    childrenCounter.setAttribute("data-type", "children");
    roomElement.appendChild(childrenCounter);

    // Child ages (if children > 0)
    if (room.children > 0) {
      const childAges = document.createElement("div");
      childAges.className = "child-ages";

      for (let i = 0; i < room.children; i++) {
        const childContainer = document.createElement("div");
        childContainer.className = "child-age-container";

        const label = document.createElement("label");
        label.className = "child-age-label";
        label.textContent = `${t("occupancy.age", config.locale)} ${t(
          "occupancy.child",
          config.locale
        )} ${i + 1} :`;

        const ageSelect = document.createElement("select");
        ageSelect.className = "child-age-select";
        ageSelect.setAttribute("data-room-index", index.toString());
        ageSelect.setAttribute("data-child-index", i.toString());

        for (let age = config.minChildAge; age <= config.maxChildAge; age++) {
          const option = document.createElement("option");
          option.value = age.toString();
          option.textContent = `${age} ${t("occupancy.years", config.locale)}`;
          if (room.childAges[i] === age) {
            option.selected = true;
          }
          ageSelect.appendChild(option);
        }

        childContainer.appendChild(label);
        childContainer.appendChild(ageSelect);
        childAges.appendChild(childContainer);
      }

      roomElement.appendChild(childAges);
    }

    container.appendChild(roomElement);
  });
}

function createCounter(
  label: string,
  value: number,
  max: number,
  min: number
): HTMLElement {
  const counter = document.createElement("div");
  counter.className = "counter";

  const labelElement = document.createElement("label");
  labelElement.textContent = label;
  counter.appendChild(labelElement);

  const controls = document.createElement("div");
  controls.className = "counter-controls";

  const decreaseBtn = document.createElement("button");
  decreaseBtn.type = "button";
  decreaseBtn.className = "counter-btn decrease";
  decreaseBtn.textContent = "-";
  decreaseBtn.disabled = value <= min;
  decreaseBtn.setAttribute("aria-label", `Decrease ${label.toLowerCase()}`);
  decreaseBtn.setAttribute("tabindex", "0");

  const valueElement = document.createElement("span");
  valueElement.className = "counter-value";
  valueElement.textContent = value.toString();
  valueElement.setAttribute("aria-live", "polite");
  valueElement.setAttribute("aria-label", `${label}: ${value}`);

  const increaseBtn = document.createElement("button");
  increaseBtn.type = "button";
  increaseBtn.className = "counter-btn increase";
  increaseBtn.textContent = "+";
  increaseBtn.disabled = value >= max;
  increaseBtn.setAttribute("aria-label", `Increase ${label.toLowerCase()}`);
  increaseBtn.setAttribute("tabindex", "0");

  controls.appendChild(decreaseBtn);
  controls.appendChild(valueElement);
  controls.appendChild(increaseBtn);
  counter.appendChild(controls);

  return counter;
}

// Modal functionality
function convertToModal(container: HTMLElement, config: WidgetConfig): void {
  // Don't convert if already in modal mode
  if (container.classList.contains("modal-mode")) {
    return;
  }

  // Store original position and styles
  const originalRect = container.getBoundingClientRect();
  const originalStyles = {
    position: container.style.position,
    top: container.style.top,
    left: container.style.left,
    width: container.style.width,
    height: container.style.height,
    zIndex: container.style.zIndex,
    transform: container.style.transform,
  };

  // Create modal overlay
  const overlay = document.createElement("div");
  overlay.className = "widget-modal-overlay";
  overlay.setAttribute("data-widget-overlay", container.id);

  // Create close button
  const closeBtn = document.createElement("button");
  closeBtn.className = "widget-modal-close";
  closeBtn.innerHTML = "×";
  closeBtn.setAttribute("aria-label", t("modal.close", config.locale));
  closeBtn.addEventListener("click", () => closeModal(container, originalStyles));

  // Add modal classes and styles
  container.classList.add("modal-mode");
  container.style.position = "fixed";
  container.style.top = "50%";
  container.style.left = "50%";
  container.style.transform = "translate(-50%, -50%)";
  container.style.width = "90vw";
  container.style.maxWidth = "600px";
  container.style.zIndex = "10001";
  container.style.borderRadius = "12px";
  container.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
  // Remove bottom positioning when modal opens
  container.style.bottom = "";

  // Add modal content class to the widget search container
  const widgetSearch = container.querySelector(".widget-search");
  if (widgetSearch) {
    widgetSearch.classList.add("widget-modal-content");
  }

  // Insert overlay before container
  container.parentNode?.insertBefore(overlay, container);
  
  // Add close button to container
  container.appendChild(closeBtn);

  // Close modal when clicking overlay
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal(container, originalStyles);
    }
  });

  // Close modal with Escape key
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal(container, originalStyles);
      document.removeEventListener("keydown", handleEscape);
    }
  };
  document.addEventListener("keydown", handleEscape);

  // Store cleanup function
  (container as any).__modalCleanup = () => {
    document.removeEventListener("keydown", handleEscape);
  };
}

function closeModal(container: HTMLElement, originalStyles: any): void {
  // Remove modal classes and restore original styles
  container.classList.remove("modal-mode");
  container.style.position = originalStyles.position;
  container.style.top = originalStyles.top;
  container.style.left = originalStyles.left;
  container.style.width = originalStyles.width;
  container.style.height = originalStyles.height;
  container.style.zIndex = originalStyles.zIndex;
  container.style.transform = originalStyles.transform;
  container.style.borderRadius = "";
  container.style.boxShadow = "";
  container.style.maxWidth = "";
  // Restore bottom positioning when modal closes
  container.style.bottom = "20px";

  // Remove modal content class from the widget search container
  const widgetSearch = container.querySelector(".widget-search");
  if (widgetSearch) {
    widgetSearch.classList.remove("widget-modal-content");
  }

  // Remove close button
  const closeBtn = container.querySelector(".widget-modal-close");
  if (closeBtn) {
    closeBtn.remove();
  }

  // Remove overlay
  const overlay = document.querySelector(`[data-widget-overlay="${container.id}"]`);
  if (overlay) {
    overlay.remove();
  }

  // Cleanup event listeners
  if ((container as any).__modalCleanup) {
    (container as any).__modalCleanup();
    delete (container as any).__modalCleanup;
  }
}
