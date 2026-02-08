import { useCallback, useRef } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import type { RootState, AppDispatch } from '@store/index';
import { setVehicleData, addPathEvent } from '@store/slices/vehicleSlice';
import { startTrip, updateTripMetrics } from '@store/slices/tripSlice';
import type { IVehicleData, IVehicleWebSocketData } from '@interfaces/vehicle.interface';
import { calculateAverageSpeed } from '@utils/calculations/averageSpeed';
import { calculateTripMileage } from '@utils/calculations/tripMileage';

const THROTTLE_INTERVAL = 1000; // Max 1 update per second

export const useVehicleTracking = () => {
  const dispatch = useDispatch<AppDispatch>();
  const store = useStore<RootState>();
  const currentVehicle = useSelector((state: RootState) => state.vehicle.currentVehicle);
  const isTripActive = useSelector((state: RootState) => state.trip.isTripActive);
  const lastUpdateTimeRef = useRef<number>(0);
  const currentVehicleRef = useRef(currentVehicle);
  const isTripActiveRef = useRef(isTripActive);
  currentVehicleRef.current = currentVehicle;
  isTripActiveRef.current = isTripActive;

  const updateVehicleData = useCallback((data: IVehicleWebSocketData) => {
    const now = Date.now();
    if (now - lastUpdateTimeRef.current < THROTTLE_INTERVAL) {
      return;
    }
    lastUpdateTimeRef.current = now;

    const prevStatus = currentVehicleRef.current?.status;
    const wasTripActive = isTripActiveRef.current;

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

    const newStatus = data.data.status;
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

    if (!wasTripActive && data.data.status !== 'stopped' && data.data.speed > 0) {
      dispatch(startTrip(vehicleData.timestamp));
    }

    const nextState = store.getState();
    const positionHistory = nextState.vehicle.positionHistory;
    const tripActive = nextState.trip.isTripActive;
    const tripStartTime = nextState.trip.metrics?.startTime ?? 0;

    if (positionHistory.length >= 2 && tripActive) {
      const averageSpeed = calculateAverageSpeed(positionHistory);
      const mileage = calculateTripMileage(positionHistory);
      dispatch(
        updateTripMetrics({
          mileage,
          averageSpeed,
          startTime: tripStartTime,
        })
      );
    }
  }, [dispatch, store]);

  return { updateVehicleData };
};
