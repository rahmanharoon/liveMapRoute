import { useSelector } from 'react-redux';
import { Fuel } from 'lucide-react';

import speedIcon from '@assets/speed-icon.svg';
import type { RootState } from '@store/index';
import { useReverseGeocode } from '@hooks/useReverseGeocode';

import styles from './styles.module.scss';

interface IVehiclePopupProps {
  isOpen: boolean;
}

const VehiclePopup = ({ isOpen }: IVehiclePopupProps) => {
  const vehicle = useSelector((state: RootState) => state.vehicle.currentVehicle);
  const tripMetrics = useSelector((state: RootState) => state.trip.metrics);
  const { placeName } = useReverseGeocode(
    vehicle?.latitude ?? null,
    vehicle?.longitude ?? null
  );


  if (!isOpen || !vehicle) return null;

  const locationDisplay =
    placeName ?? `${vehicle.latitude.toFixed(6)}, ${vehicle.longitude.toFixed(6)}`;

  return (
    <div className={styles.popup}>
      <div className={styles.header}>
        <h3 className={styles.title}>Last location</h3>
      </div>

      <div className={styles.address}>
        {locationDisplay}
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <img src={speedIcon} alt="Speed" className={styles.metricIcon} />
          <span className={styles.metricValue}>
            {tripMetrics?.averageSpeed.toFixed(0) || '0'} km/h
          </span>
        </div>

        <div className={styles.metric}>
          <Fuel className={styles.fuelIcon} size={20} aria-hidden />
          <span className={styles.metricValue}>
            {tripMetrics?.mileage != null
              ? `${tripMetrics.mileage.toFixed(2)} km`
              : '0.00 km'}
          </span>
        </div>

        <div className={styles.metric}>
          <img src={speedIcon} alt="Speed" className={styles.metricIcon} />
          <span className={styles.metricValue}>
            {vehicle.status ?? '—'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VehiclePopup;
