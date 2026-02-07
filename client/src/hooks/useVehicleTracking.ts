import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@store/index';
import { useWebSocket } from './useWebSocket';
import { setVehicleData, addPathEvent } from '@store/slices/vehicleSlice';
import { startTrip, updateTripMetrics } from '@store/slices/tripSlice';
import type { IVehicleData } from '@interfaces/vehicle.interface';
import { calculateAverageSpeed } from '@utils/calculations/averageSpeed';
import { calculateTripMileage } from '@utils/calculations/tripMileage';

const VEHICLE_PLATE_NUMBER = 'DXB-CX-36357';

export const useVehicleTracking = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, data } = useWebSocket(VEHICLE_PLATE_NUMBER);
  const { positionHistory, currentVehicle } = useSelector(
    (state: RootState) => state.vehicle
  );
  const { isTripActive } = useSelector((state: RootState) => state.trip);
  const lastUpdateTimeRef = useRef<number>(0);
  const throttleInterval = 1000; // Max 1 update per second

  useEffect(() => {
    if (!data) return;

    const now = Date.now();
    if (now - lastUpdateTimeRef.current < throttleInterval) {
      return; // Throttle updates
    }
    lastUpdateTimeRef.current = now;

    const vehicleData: IVehicleData = {
      plateNumber: data.plate,
      latitude: data.data.lat,
      longitude: data.data.lng,
      status: data.data.status,
      timestamp: new Date(data.data.timestamp).getTime(),
      heading: data.data.angle,
      speed: data.data.speed,
    };

    dispatch(setVehicleData(vehicleData));

    // Record stop/idle events when status changes to stopped or idle
    const newStatus = data.data.status;
    const prevStatus = currentVehicle?.status;
    const eventType = newStatus === 'stopped' ? 'stop' : newStatus === 'idle' ? 'idle' : null;
    if (eventType && prevStatus !== newStatus) {
      dispatch(
        addPathEvent({
          type: eventType,
          latitude: vehicleData.latitude,
          longitude: vehicleData.longitude,
          timestamp: vehicleData.timestamp,
        })
      );
    }

    // Start trip if not active and vehicle is moving
    if (!isTripActive && data.data.status !== 'stopped' && data.data.speed > 0) {
      dispatch(startTrip(vehicleData.timestamp));
    }
  }, [data, dispatch, isTripActive, currentVehicle?.status]);

  // Calculate trip metrics when position history updates
  useEffect(() => {
    if (positionHistory.length < 2 || !isTripActive) return;

    const averageSpeed = calculateAverageSpeed(positionHistory);
    const mileage = calculateTripMileage(positionHistory);

    const startTime =
      positionHistory[0]?.timestamp || Date.now();

    dispatch(
      updateTripMetrics({
        mileage,
        averageSpeed,
        startTime,
      })
    );
  }, [positionHistory, isTripActive, dispatch]);

  return {
    status,
    currentVehicle,
    positionHistory,
  };
};
