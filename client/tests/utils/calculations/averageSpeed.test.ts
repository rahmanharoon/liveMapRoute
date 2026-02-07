import { calculateAverageSpeed } from '@utils/calculations/averageSpeed';
import { IVehicleData } from '@interfaces/vehicle.interface';

describe('calculateAverageSpeed', () => {
  it('should return 0 for empty array', () => {
    const speed = calculateAverageSpeed([]);
    expect(speed).toBe(0);
  });

  it('should return 0 for single position', () => {
    const positions: IVehicleData[] = [
      {
        plateNumber: 'DXB-CX-36357',
        latitude: 25.13932,
        longitude: 55.12843,
        status: 'moving',
        timestamp: Date.now(),
      },
    ];

    const speed = calculateAverageSpeed(positions);
    expect(speed).toBe(0);
  });

  it('should calculate average speed correctly', () => {
    const now = Date.now();
    const positions: IVehicleData[] = [
      {
        plateNumber: 'DXB-CX-36357',
        latitude: 25.13932,
        longitude: 55.12843,
        status: 'moving',
        timestamp: now,
      },
      {
        plateNumber: 'DXB-CX-36357',
        latitude: 25.14032,
        longitude: 55.12943,
        status: 'moving',
        timestamp: now + 1000, // 1 second later
      },
    ];

    const speed = calculateAverageSpeed(positions);
    expect(speed).toBeGreaterThan(0);
  });
});
