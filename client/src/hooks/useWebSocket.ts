import { useEffect, useState, useCallback, useRef } from 'react';
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToVehicle,
  unsubscribeFromVehicle,
} from '@services/websocket';
import { useVehicleTracking } from './useVehicleTracking';

export type WebSocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

const PLATE_NUMBER = 'DXB-CX-36357';

export const useWebSocket = () => {
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const { updateVehicleData } = useVehicleTracking();
  const updateVehicleDataRef = useRef(updateVehicleData);
  updateVehicleDataRef.current = updateVehicleData;

  useEffect(() => {
    const socket = connectWebSocket();

    const handleConnect = () => {
      setStatus('connected');
    };

    const handleDisconnect = () => {
      setStatus('disconnected');
    };

    const handleError = () => {
      setStatus('error');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleError);

    setStatus('connecting');

    subscribeToVehicle(PLATE_NUMBER, (vehicleData) => {
      setStatus('connected');
      updateVehicleDataRef.current(vehicleData);
    });

    return () => {
      unsubscribeFromVehicle(PLATE_NUMBER);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleError);
    };
  }, []);

  const reconnect = useCallback(() => {
    disconnectWebSocket();
    connectWebSocket();
    subscribeToVehicle(PLATE_NUMBER, (vehicleData) => {
      setStatus('connected');
      updateVehicleDataRef.current(vehicleData);
    });
  }, []);

  return { status, reconnect };
};
