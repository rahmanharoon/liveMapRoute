import { IVehicleData } from '@interfaces/vehicle.interface';
import { calculateDistance } from './haversine';

/**
 * Calculate cumulative trip mileage from vehicle position updates.
 * Positions are sorted by timestamp so distance is summed in chronological order
 * (handles out-of-order WebSocket messages).
 * @param positions Array of vehicle position data points
 * @returns Total mileage in kilometers
 */
export const calculateTripMileage = (positions: IVehicleData[]): number => {
  if (positions.length < 2) {
    return 0;
  }

  const sorted = [...positions].sort((a, b) => a.timestamp - b.timestamp);
  let totalMileage = 0;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    totalMileage += calculateDistance(
      prev.latitude,
      prev.longitude,
      curr.latitude,
      curr.longitude
    );
  }

  return Math.round(totalMileage * 100) / 100; // Round to 2 decimal places
};
