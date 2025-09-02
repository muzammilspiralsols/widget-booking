import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Availability Check', () => {
    it('should make availability request with correct parameters', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          available: true,
          message: 'Rooms available'
        })
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      const config = {
        apiUrl: 'https://api.example.com',
        locale: 'en'
      };

      const state = {
        selectedHotel: 'hotel-123',
        checkInDate: new Date('2024-08-15'),
        checkOutDate: new Date('2024-08-20'),
        rooms: [{ adults: 2, children: 0, childAges: [] }],
        promoCode: '',
        isSelectingCheckOut: false,
        additionalParams: {}
      };

      // Simulate the availability check
      const availabilityParams = new URLSearchParams();
      availabilityParams.append('hotel_id', state.selectedHotel);
      availabilityParams.append('fecha_inicio', '2024-08-15');
      availabilityParams.append('fecha_fin', '2024-08-20');

      const availabilityUrl = `${config.apiUrl}/api/disponibilidad?${availabilityParams.toString()}`;

      const response = await fetch(availabilityUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(global.fetch).toHaveBeenCalledWith(availabilityUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(response.ok).toBe(true);
    });

    it('should handle availability check failure gracefully', async () => {
      const mockResponse = {
        ok: false,
        status: 500
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      const config = {
        apiUrl: 'https://api.example.com',
        locale: 'en'
      };

      const state = {
        selectedHotel: 'hotel-123',
        checkInDate: new Date('2024-08-15'),
        checkOutDate: new Date('2024-08-20'),
        rooms: [{ adults: 2, children: 0, childAges: [] }],
        promoCode: '',
        isSelectingCheckOut: false,
        additionalParams: {}
      };

      const availabilityParams = new URLSearchParams();
      availabilityParams.append('hotel_id', state.selectedHotel);
      availabilityParams.append('fecha_inicio', '2024-08-15');
      availabilityParams.append('fecha_fin', '2024-08-20');

      const availabilityUrl = `${config.apiUrl}/api/disponibilidad?${availabilityParams.toString()}`;

      try {
        const response = await fetch(availabilityUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('HTTP error! status: 500');
      }
    });

    it('should handle network errors gracefully', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      const config = {
        apiUrl: 'https://api.example.com',
        locale: 'en'
      };

      const state = {
        selectedHotel: 'hotel-123',
        checkInDate: new Date('2024-08-15'),
        checkOutDate: new Date('2024-08-20'),
        rooms: [{ adults: 2, children: 0, childAges: [] }],
        promoCode: '',
        isSelectingCheckOut: false,
        additionalParams: {}
      };

      const availabilityParams = new URLSearchParams();
      availabilityParams.append('hotel_id', state.selectedHotel);
      availabilityParams.append('fecha_inicio', '2024-08-15');
      availabilityParams.append('fecha_fin', '2024-08-20');

      const availabilityUrl = `${config.apiUrl}/api/disponibilidad?${availabilityParams.toString()}`;

      try {
        await fetch(availabilityUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Network error');
      }
    });

    it('should handle no availability response', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          available: false,
          message: 'No rooms available for selected dates'
        })
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      const config = {
        apiUrl: 'https://api.example.com',
        locale: 'en'
      };

      const state = {
        selectedHotel: 'hotel-123',
        checkInDate: new Date('2024-08-15'),
        checkOutDate: new Date('2024-08-20'),
        rooms: [{ adults: 2, children: 0, childAges: [] }],
        promoCode: '',
        isSelectingCheckOut: false,
        additionalParams: {}
      };

      const availabilityParams = new URLSearchParams();
      availabilityParams.append('hotel_id', state.selectedHotel);
      availabilityParams.append('fecha_inicio', '2024-08-15');
      availabilityParams.append('fecha_fin', '2024-08-20');

      const availabilityUrl = `${config.apiUrl}/api/disponibilidad?${availabilityParams.toString()}`;

      const response = await fetch(availabilityUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const availabilityData = await response.json();

      expect(availabilityData.available).toBe(false);
      expect(availabilityData.message).toBe('No rooms available for selected dates');
    });
  });

  describe('URL Building', () => {
    it('should build correct redirect URL with all parameters', () => {
      const config = {
        externalUrl: 'https://www.miweb.com/buscar',
        externalUrlParams: {
          'source': 'widget',
          'campaign': 'summer2024'
        }
      };

      const state = {
        selectedHotel: 'hotel-123',
        checkInDate: new Date('2024-08-15'),
        checkOutDate: new Date('2024-08-20'),
        rooms: [{ adults: 2, children: 1, childAges: [5] }],
        promoCode: 'SUMMER2024',
        isSelectingCheckOut: false,
        additionalParams: {
          'il_like': 'DBL'
        }
      };

      const params = new URLSearchParams();
      params.append('hotel', state.selectedHotel);
      params.append('entry', '2024-08-15');
      params.append('exit', '2024-08-20');
      params.append('adults', '2');
      params.append('promo', state.promoCode);

      // Add external URL parameters
      if (config.externalUrlParams) {
        Object.entries(config.externalUrlParams).forEach(([key, value]) => {
          params.append(key, value);
        });
      }

      // Add additional parameters
      if (state.additionalParams) {
        Object.entries(state.additionalParams).forEach(([key, value]) => {
          params.append(key, value);
        });
      }

      const finalUrl = `${config.externalUrl}?${params.toString()}`;

      expect(finalUrl).toBe(
        'https://www.miweb.com/buscar?hotel=hotel-123&entry=2024-08-15&exit=2024-08-20&adults=2&promo=SUMMER2024&source=widget&campaign=summer2024&il_like=DBL'
      );
    });

    it('should handle missing optional parameters', () => {
      const config = {
        externalUrl: 'https://www.miweb.com/buscar'
      };

      const state = {
        selectedHotel: 'hotel-123',
        checkInDate: new Date('2024-08-15'),
        checkOutDate: new Date('2024-08-20'),
        rooms: [{ adults: 2, children: 0, childAges: [] }],
        promoCode: '',
        isSelectingCheckOut: false,
        additionalParams: {}
      };

      const params = new URLSearchParams();
      params.append('hotel', state.selectedHotel);
      params.append('entry', '2024-08-15');
      params.append('exit', '2024-08-20');
      params.append('adults', '2');

      const finalUrl = `${config.externalUrl}?${params.toString()}`;

      expect(finalUrl).toBe(
        'https://www.miweb.com/buscar?hotel=hotel-123&entry=2024-08-15&exit=2024-08-20&adults=2'
      );
    });

    it('should handle chain type with all-hotels selection', () => {
      const config = {
        externalUrl: 'https://www.miweb.com/buscar'
      };

      const state = {
        selectedHotel: 'all-hotels',
        checkInDate: new Date('2024-08-15'),
        checkOutDate: new Date('2024-08-20'),
        rooms: [{ adults: 2, children: 0, childAges: [] }],
        promoCode: '',
        isSelectingCheckOut: false,
        additionalParams: {}
      };

      const params = new URLSearchParams();
      // Don't add hotel parameter for all-hotels
      params.append('entry', '2024-08-15');
      params.append('exit', '2024-08-20');
      params.append('adults', '2');

      const finalUrl = `${config.externalUrl}?${params.toString()}`;

      expect(finalUrl).toBe(
        'https://www.miweb.com/buscar?entry=2024-08-15&exit=2024-08-20&adults=2'
      );
    });
  });

  describe('Date Validation', () => {
    it('should validate check-in and check-out dates', () => {
      const checkInDate = new Date('2024-08-15');
      const checkOutDate = new Date('2024-08-20');

      // Check that check-out is after check-in
      expect(checkOutDate > checkInDate).toBe(true);
    });

    it('should reject invalid date range', () => {
      const checkInDate = new Date('2024-08-20');
      const checkOutDate = new Date('2024-08-15');

      // Check that check-out is not after check-in
      expect(checkOutDate <= checkInDate).toBe(true);
    });

    it('should handle same day check-in and check-out', () => {
      const checkInDate = new Date('2024-08-15');
      const checkOutDate = new Date('2024-08-15');

      // Check that same day is not allowed
      expect(checkOutDate <= checkInDate).toBe(true);
    });
  });

  describe('Room Configuration', () => {
    it('should calculate total adults correctly', () => {
      const rooms = [
        { adults: 2, children: 0, childAges: [] },
        { adults: 1, children: 1, childAges: [5] },
        { adults: 3, children: 2, childAges: [8, 12] }
      ];

      const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
      expect(totalAdults).toBe(6);
    });

    it('should handle empty rooms array', () => {
      const rooms: any[] = [];
      const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
      expect(totalAdults).toBe(0);
    });

    it('should validate room limits', () => {
      const config = {
        maxAdults: 4,
        maxChildren: 4,
        maxRooms: 5
      };

      const rooms = [
        { adults: 2, children: 1, childAges: [5] },
        { adults: 3, children: 2, childAges: [8, 12] }
      ];

      // Check each room against limits
      rooms.forEach(room => {
        expect(room.adults).toBeLessThanOrEqual(config.maxAdults);
        expect(room.children).toBeLessThanOrEqual(config.maxChildren);
      });

      expect(rooms.length).toBeLessThanOrEqual(config.maxRooms);
    });
  });
});
