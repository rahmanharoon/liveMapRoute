import type { IVehicleData } from '@interfaces/vehicle.interface';
import { calculateDistance } from './haversine';

/**
 * Calculate average speed from vehicle position updates
 * @param positions Array of vehicle position data points
 * @returns Average speed in km/h
 */
export const calculateAverageSpeed = (
  positions: IVehicleData[]
): number => {
  if (positions.length < 2) {
    return 0;
  }

  let totalDistance = 0;
  let totalTime = 0;

  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];

    const distance = calculateDistance(
      prev.latitude,
      prev.longitude,
      curr.latitude,
      curr.longitude
    );

    const timeDiff = (curr.timestamp - prev.timestamp) / 1000; // Convert to seconds

    if (timeDiff > 0) {
      totalDistance += distance;
      totalTime += timeDiff;
    }
  }

  if (totalTime === 0) {
    return 0;
  }

  // Calculate average speed in km/h
  const averageSpeed = (totalDistance / totalTime) * 3600;
  return Math.round(averageSpeed * 100) / 100; // Round to 2 decimal places
};
