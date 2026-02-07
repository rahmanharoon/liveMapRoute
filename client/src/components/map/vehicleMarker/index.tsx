import React, { useEffect, useRef } from 'react';
import { Marker } from 'react-map-gl';
import arrowIcon from '@assets/arrow-icon.svg';
import styles from './styles.module.scss';

export interface IVehicleMarkerProps {
  latitude: number;
  longitude: number;
  heading?: number;
  onClick?: () => void;
}

const VehicleMarker: React.FC<IVehicleMarkerProps> = ({
  latitude,
  longitude,
  heading = 0,
  onClick,
}) => {
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.style.transform = `rotate(${heading}deg)`;
    }
  }, [heading]);

  return (
    <Marker
      latitude={latitude}
      longitude={longitude}
      anchor="center"
      onClick={onClick}
    >
      <div ref={markerRef} className={styles.marker}>
        <img src={arrowIcon} alt="Vehicle" className={styles.icon} />
      </div>
    </Marker>
  );
};

export default VehicleMarker;
