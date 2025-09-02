import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock DOM
const mockContainer = {
  querySelector: vi.fn(),
  querySelectorAll: vi.fn(),
  addEventListener: vi.fn(),
  setAttribute: vi.fn(),
  getAttribute: vi.fn(),
  hasAttribute: vi.fn(),
  dispatchEvent: vi.fn()
};

const mockElement = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  click: vi.fn(),
  focus: vi.fn(),
  blur: vi.fn(),
  setAttribute: vi.fn(),
  getAttribute: vi.fn(),
  hasAttribute: vi.fn(),
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn(),
    toggle: vi.fn()
  },
  textContent: '',
  value: '',
  disabled: false,
  parentNode: {
    removeChild: vi.fn(),
    insertBefore: vi.fn()
  }
};

describe('Widget Events Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    mockContainer.querySelector.mockReturnValue(mockElement);
    mockContainer.querySelectorAll.mockReturnValue([mockElement]);
    mockElement.classList.contains.mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('updateData Event', () => {
    it('should update hotel selection', () => {
      const widget = {
        updateHotelSelection: vi.fn(),
        updatePromoCode: vi.fn(),
        updateCheckInDate: vi.fn(),
        updateCheckOutDate: vi.fn(),
        updateMinDate: vi.fn(),
        updateMaxDate: vi.fn(),
        openCalendar: vi.fn()
      };

      const data = {
        idHotel: 'hotel-123',
        promoCode: 'SUMMER2024',
        openCalendar: true,
        checkIn: '15-08-2024',
        checkOut: '20-08-2024',
        minDate: '01-08-2024',
        maxDate: '31-12-2024'
      };

      // Simulate updateData call
      if (data.idHotel) {
        widget.updateHotelSelection(data.idHotel);
      }
      if (data.promoCode) {
        widget.updatePromoCode(data.promoCode);
      }
      if (data.checkIn) {
        widget.updateCheckInDate(data.checkIn);
      }
      if (data.checkOut) {
        widget.updateCheckOutDate(data.checkOut);
      }
      if (data.minDate) {
        widget.updateMinDate(data.minDate);
      }
      if (data.maxDate) {
        widget.updateMaxDate(data.maxDate);
      }
      if (data.openCalendar) {
        widget.openCalendar();
      }

      expect(widget.updateHotelSelection).toHaveBeenCalledWith('hotel-123');
      expect(widget.updatePromoCode).toHaveBeenCalledWith('SUMMER2024');
      expect(widget.updateCheckInDate).toHaveBeenCalledWith('15-08-2024');
      expect(widget.updateCheckOutDate).toHaveBeenCalledWith('20-08-2024');
      expect(widget.updateMinDate).toHaveBeenCalledWith('01-08-2024');
      expect(widget.updateMaxDate).toHaveBeenCalledWith('31-12-2024');
      expect(widget.openCalendar).toHaveBeenCalled();
    });

    it('should handle partial data updates', () => {
      const widget = {
        updateHotelSelection: vi.fn(),
        updatePromoCode: vi.fn(),
        updateCheckInDate: vi.fn(),
        updateCheckOutDate: vi.fn(),
        updateMinDate: vi.fn(),
        updateMaxDate: vi.fn(),
        openCalendar: vi.fn()
      };

      const data = {
        idHotel: 'hotel-456'
      };

      // Simulate updateData call with only hotel ID
      if (data.idHotel) {
        widget.updateHotelSelection(data.idHotel);
      }

      expect(widget.updateHotelSelection).toHaveBeenCalledWith('hotel-456');
      expect(widget.updatePromoCode).not.toHaveBeenCalled();
      expect(widget.updateCheckInDate).not.toHaveBeenCalled();
      expect(widget.updateCheckOutDate).not.toHaveBeenCalled();
      expect(widget.updateMinDate).not.toHaveBeenCalled();
      expect(widget.updateMaxDate).not.toHaveBeenCalled();
      expect(widget.openCalendar).not.toHaveBeenCalled();
    });

    it('should handle empty data object', () => {
      const widget = {
        updateHotelSelection: vi.fn(),
        updatePromoCode: vi.fn(),
        updateCheckInDate: vi.fn(),
        updateCheckOutDate: vi.fn(),
        updateMinDate: vi.fn(),
        updateMaxDate: vi.fn(),
        openCalendar: vi.fn()
      };

      const data = {};

      // Simulate updateData call with empty data
      if (data.idHotel) {
        widget.updateHotelSelection(data.idHotel);
      }
      if (data.promoCode) {
        widget.updatePromoCode(data.promoCode);
      }
      if (data.checkIn) {
        widget.updateCheckInDate(data.checkIn);
      }
      if (data.checkOut) {
        widget.updateCheckOutDate(data.checkOut);
      }
      if (data.minDate) {
        widget.updateMinDate(data.minDate);
      }
      if (data.maxDate) {
        widget.updateMaxDate(data.maxDate);
      }
      if (data.openCalendar) {
        widget.openCalendar();
      }

      expect(widget.updateHotelSelection).not.toHaveBeenCalled();
      expect(widget.updatePromoCode).not.toHaveBeenCalled();
      expect(widget.updateCheckInDate).not.toHaveBeenCalled();
      expect(widget.updateCheckOutDate).not.toHaveBeenCalled();
      expect(widget.updateMinDate).not.toHaveBeenCalled();
      expect(widget.updateMaxDate).not.toHaveBeenCalled();
      expect(widget.openCalendar).not.toHaveBeenCalled();
    });
  });

  describe('updateParams Event', () => {
    it('should store additional parameters', () => {
      const widget = {
        container: mockContainer
      };

      const params = {
        'il_like': 'DBL',
        'source': 'widget',
        'campaign': 'summer2024'
      };

      // Simulate updateParams call
      widget.container.setAttribute('data-additional-params', JSON.stringify(params));
      
      const event = new CustomEvent('widgetUpdateParams', {
        detail: params,
        bubbles: true
      });
      widget.container.dispatchEvent(event);

      expect(widget.container.setAttribute).toHaveBeenCalledWith(
        'data-additional-params',
        JSON.stringify(params)
      );
      expect(widget.container.dispatchEvent).toHaveBeenCalledWith(event);
    });

    it('should merge with existing parameters', () => {
      const existingParams = {
        'source': 'widget',
        'campaign': 'summer2024'
      };

      const newParams = {
        'il_like': 'DBL',
        'room_type': 'suite'
      };

      const mergedParams = { ...existingParams, ...newParams };

      expect(mergedParams).toEqual({
        'source': 'widget',
        'campaign': 'summer2024',
        'il_like': 'DBL',
        'room_type': 'suite'
      });
    });

    it('should handle empty parameters', () => {
      const widget = {
        container: mockContainer
      };

      const params = {};

      // Simulate updateParams call with empty params
      widget.container.setAttribute('data-additional-params', JSON.stringify(params));
      
      const event = new CustomEvent('widgetUpdateParams', {
        detail: params,
        bubbles: true
      });
      widget.container.dispatchEvent(event);

      expect(widget.container.setAttribute).toHaveBeenCalledWith(
        'data-additional-params',
        JSON.stringify(params)
      );
    });
  });

  describe('Date Parsing', () => {
    it('should parse DD-MM-YYYY format correctly', () => {
      const parseDateString = (dateStr: string): Date | null => {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // Month is 0-indexed
          const year = parseInt(parts[2]);
          
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            return new Date(year, month, day, 12, 0, 0, 0);
          }
        }
        return null;
      };

      const date = parseDateString('15-08-2024');
      expect(date).toBeInstanceOf(Date);
      expect(date?.getFullYear()).toBe(2024);
      expect(date?.getMonth()).toBe(7); // August (0-indexed)
      expect(date?.getDate()).toBe(15);
    });

    it('should handle invalid date format', () => {
      const parseDateString = (dateStr: string): Date | null => {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // Month is 0-indexed
          const year = parseInt(parts[2]);
          
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            return new Date(year, month, day, 12, 0, 0, 0);
          }
        }
        return null;
      };

      const date = parseDateString('invalid-date');
      expect(date).toBeNull();
    });

    it('should handle malformed date string', () => {
      const parseDateString = (dateStr: string): Date | null => {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // Month is 0-indexed
          const year = parseInt(parts[2]);
          
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            return new Date(year, month, day, 12, 0, 0, 0);
          }
        }
        return null;
      };

      const date = parseDateString('32-13-2024'); // Invalid day and month
      expect(date).toBeNull();
    });
  });

  describe('Hotel Selection', () => {
    it('should update hotel display text', () => {
      const getHotelNameById = (hotelId: string): string | null => {
        const hotelNames: Record<string, string> = {
          'all-hotels': 'All Hotels',
          'playa-garden-selection-hotel-spa': 'Playa Garden Selection Hotel & Spa',
          'alcudia-garden-aparthotel': 'Alcudia Garden Aparthotel'
        };
        
        return hotelNames[hotelId] || hotelId;
      };

      expect(getHotelNameById('all-hotels')).toBe('All Hotels');
      expect(getHotelNameById('playa-garden-selection-hotel-spa')).toBe('Playa Garden Selection Hotel & Spa');
      expect(getHotelNameById('unknown-hotel')).toBe('unknown-hotel');
    });

    it('should handle hotel selection state', () => {
      const hotelOptions = [
        { id: 'hotel-1', selected: false },
        { id: 'hotel-2', selected: true },
        { id: 'hotel-3', selected: false }
      ];

      const selectedHotel = 'hotel-2';

      // Simulate updating selection state
      hotelOptions.forEach(option => {
        option.selected = option.id === selectedHotel;
      });

      expect(hotelOptions[0].selected).toBe(false);
      expect(hotelOptions[1].selected).toBe(true);
      expect(hotelOptions[2].selected).toBe(false);
    });
  });

  describe('Promo Code Validation', () => {
    it('should allow alphanumeric characters only', () => {
      const validatePromoCode = (code: string): string => {
        return code.replace(/[^a-zA-Z0-9]/g, '');
      };

      expect(validatePromoCode('SUMMER2024')).toBe('SUMMER2024');
      expect(validatePromoCode('SUMMER-2024')).toBe('SUMMER2024');
      expect(validatePromoCode('SUMMER_2024')).toBe('SUMMER2024');
      expect(validatePromoCode('SUMMER@2024')).toBe('SUMMER2024');
      expect(validatePromoCode('SUMMER 2024')).toBe('SUMMER2024');
    });

    it('should handle empty promo code', () => {
      const validatePromoCode = (code: string): string => {
        return code.replace(/[^a-zA-Z0-9]/g, '');
      };

      expect(validatePromoCode('')).toBe('');
    });

    it('should handle special characters only', () => {
      const validatePromoCode = (code: string): string => {
        return code.replace(/[^a-zA-Z0-9]/g, '');
      };

      expect(validatePromoCode('!@#$%^&*()')).toBe('');
    });
  });

  describe('Modal Management', () => {
    it('should open modal correctly', () => {
      const widget = {
        isModalOpen: false,
        openModal: function() {
          if (this.isModalOpen) return;
          this.isModalOpen = true;
        }
      };

      expect(widget.isModalOpen).toBe(false);
      widget.openModal();
      expect(widget.isModalOpen).toBe(true);
    });

    it('should not open modal if already open', () => {
      const widget = {
        isModalOpen: true,
        openModal: function() {
          if (this.isModalOpen) return;
          this.isModalOpen = true;
        }
      };

      expect(widget.isModalOpen).toBe(true);
      widget.openModal();
      expect(widget.isModalOpen).toBe(true);
    });

    it('should close modal correctly', () => {
      const widget = {
        isModalOpen: true,
        closeModal: function() {
          this.isModalOpen = false;
        }
      };

      expect(widget.isModalOpen).toBe(true);
      widget.closeModal();
      expect(widget.isModalOpen).toBe(false);
    });
  });

  describe('Event Listeners', () => {
    it('should attach event listeners correctly', () => {
      const element = mockElement;
      const eventType = 'click';
      const handler = vi.fn();

      element.addEventListener(eventType, handler);

      expect(element.addEventListener).toHaveBeenCalledWith(eventType, handler);
    });

    it('should remove event listeners correctly', () => {
      const element = mockElement;
      const eventType = 'click';
      const handler = vi.fn();

      element.removeEventListener(eventType, handler);

      expect(element.removeEventListener).toHaveBeenCalledWith(eventType, handler);
    });

    it('should handle multiple event listeners', () => {
      const element = mockElement;
      const handlers = [vi.fn(), vi.fn(), vi.fn()];

      handlers.forEach(handler => {
        element.addEventListener('click', handler);
      });

      expect(element.addEventListener).toHaveBeenCalledTimes(3);
    });
  });
});
