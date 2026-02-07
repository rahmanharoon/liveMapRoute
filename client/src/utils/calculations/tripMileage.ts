import { IVehicleData } from '@interfaces/vehicle.interface';
import { calculateDistance } from './haversine';

/**
 * Calculate cumulative trip mileage from vehicle position updates
 * @param positions Array of vehicle position data points
 * @returns Total mileage in kilometers
 */
export const calculateTripMileage = (
  positions: IVehicleData[]
): number => {
  if (positions.length < 2) {
    return 0;
  }

  let totalMileage = 0;

  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];

    const distance = calculateDistance(
      prev.latitude,
      prev.longitude,
      curr.latitude,
      curr.longitude
    );

    totalMileage += distance;
  }

  return Math.round(totalMileage * 100) / 100; // Round to 2 decimal places
};
