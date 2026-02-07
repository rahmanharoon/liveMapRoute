import { calculateDistance } from '@utils/calculations/haversine';

describe('calculateDistance', () => {
  it('should calculate distance between two coordinates', () => {
    // Distance between Dubai (25.13932, 55.12843) and nearby point
    const lat1 = 25.13932;
    const lon1 = 55.12843;
    const lat2 = 25.14032;
    const lon2 = 55.12943;

    const distance = calculateDistance(lat1, lon1, lat2, lon2);
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(1); // Should be less than 1 km
  });

  it('should return 0 for same coordinates', () => {
    const lat = 25.13932;
    const lon = 55.12843;

    const distance = calculateDistance(lat, lon, lat, lon);
    expect(distance).toBe(0);
  });

  it('should handle negative coordinates', () => {
    const lat1 = -25.13932;
    const lon1 = -55.12843;
    const lat2 = -25.14032;
    const lon2 = -55.12943;

    const distance = calculateDistance(lat1, lon1, lat2, lon2);
    expect(distance).toBeGreaterThan(0);
  });
});
