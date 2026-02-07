import { io, Socket } from 'socket.io-client';
import { IVehicleWebSocketData } from '@interfaces/vehicle.interface';

const SOCKET_SERVER_URL =
  import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3000';

let socket: Socket | null = null;

export const connectWebSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });
  }
  return socket;
};

export const disconnectWebSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribeToVehicle = (
  plateNumber: string,
  callback: (data: IVehicleWebSocketData) => void
): void => {
  if (!socket) {
    socket = connectWebSocket();
  }

  socket.emit('subscribeToVehicle', { plate: plateNumber });

  socket.on('vehicleData', (data: IVehicleWebSocketData) => {
    callback(data);
  });

  socket.on('subscribed', () => {
    console.log(`Subscribed to vehicle ${plateNumber}`);
  });

  socket.on('error', (error: { message: string }) => {
    console.error('WebSocket error:', error.message);
  });
};

export const unsubscribeFromVehicle = (plateNumber: string): void => {
  if (socket) {
    socket.emit('unsubscribeFromVehicle', { plate: plateNumber });
    socket.off('vehicleData');
  }
};

export const getSocket = (): Socket | null => {
  return socket;
};
