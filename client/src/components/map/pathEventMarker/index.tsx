import React from 'react';
import { Marker } from 'react-map-gl';
import idleIcon from '@assets/idle-icon.svg';
import stopIcon from '@assets/stop-icon.svg';
import type { PathEventType } from '@interfaces/vehicle.interface';
import styles from './styles.module.scss';

export interface IPathEventMarkerProps {
  type: PathEventType;
  latitude: number;
  longitude: number;
}

const iconByType: Record<PathEventType, string> = {
  idle: idleIcon,
  stop: stopIcon,
};

const PathEventMarker: React.FC<IPathEventMarkerProps> = ({
  type,
  latitude,
  longitude,
}) => {
  const icon = iconByType[type];
  const title = type === 'idle' ? 'Idle' : 'Stop';

  return (
    <Marker latitude={latitude} longitude={longitude} anchor="center">
      <div className={styles.marker} title={title}>
        <img src={icon} alt={title} className={styles.icon} />
      </div>
    </Marker>
  );
};

export default PathEventMarker;
