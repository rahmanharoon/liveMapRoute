/** Vehicle status from telemetry (use for type-safe comparisons) */
export type VehicleStatus = 'moving' | 'idle' | 'stopped';

export interface IVehicleData {
  plateNumber: string;
  latitude: number;
  longitude: number;
  status: VehicleStatus | string;
  timestamp: number;
  heading?: number;
  speed?: number;
}

export type PathEventType = 'stop' | 'idle';

export interface IPathEvent {
  type: PathEventType;
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface IVehicleWebSocketData {
  plate: string;
  data: {
    lat: number;
    lng: number;
    angle: number;
    speed: number;
    status: string;
    timestamp: string;
  };
}
