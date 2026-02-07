import { useEffect, useState, useCallback } from 'react';
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToVehicle,
  unsubscribeFromVehicle,
} from '@services/websocket';
import type { IVehicleWebSocketData } from '@interfaces/vehicle.interface';

export type WebSocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export const useWebSocket = (plateNumber: string) => {
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [data, setData] = useState<IVehicleWebSocketData | null>(null);

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

    subscribeToVehicle(plateNumber, (vehicleData) => {
      setData(vehicleData);
      setStatus('connected');
    });

    return () => {
      unsubscribeFromVehicle(plateNumber);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleError);
    };
  }, [plateNumber]);

  const reconnect = useCallback(() => {
    disconnectWebSocket();
    connectWebSocket();
    subscribeToVehicle(plateNumber, (vehicleData) => {
      setData(vehicleData);
      setStatus('connected');
    });
  }, [plateNumber]);

  return { status, data, reconnect };
};
