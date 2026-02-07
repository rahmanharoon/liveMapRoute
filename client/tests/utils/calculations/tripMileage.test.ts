import { calculateTripMileage } from '@utils/calculations/tripMileage';
import { IVehicleData } from '@interfaces/vehicle.interface';

describe('calculateTripMileage', () => {
  it('should return 0 for empty array', () => {
    const mileage = calculateTripMileage([]);
    expect(mileage).toBe(0);
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

    const mileage = calculateTripMileage(positions);
    expect(mileage).toBe(0);
  });

  it('should calculate cumulative mileage correctly', () => {
    const positions: IVehicleData[] = [
      {
        plateNumber: 'DXB-CX-36357',
        latitude: 25.13932,
        longitude: 55.12843,
        status: 'moving',
        timestamp: Date.now(),
      },
      {
        plateNumber: 'DXB-CX-36357',
        latitude: 25.14032,
        longitude: 55.12943,
        status: 'moving',
        timestamp: Date.now() + 1000,
      },
      {
        plateNumber: 'DXB-CX-36357',
        latitude: 25.14132,
        longitude: 55.13043,
        status: 'moving',
        timestamp: Date.now() + 2000,
      },
    ];

    const mileage = calculateTripMileage(positions);
    expect(mileage).toBeGreaterThan(0);
  });
});
