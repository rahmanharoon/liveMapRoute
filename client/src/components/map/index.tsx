import React, { useMemo, useRef, useEffect } from 'react';
import Map, { Source, Layer, MapRef } from 'react-map-gl';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@store/index';
import { updateMapState } from '@store/slices/mapSlice';
import VehicleMarker from './vehicleMarker';
import PathEventMarker from './pathEventMarker';

import styles from './styles.module.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface IMapProps {
  onVehicleClick?: () => void;
}

const MapComponent: React.FC<IMapProps> = ({ onVehicleClick }) => {
  const dispatch = useDispatch<AppDispatch>();
  const mapRef = useRef<MapRef>(null);
  const { zoom, center, bearing } = useSelector((state: RootState) => state.map);
  const { currentVehicle, positionHistory, pathEvents } = useSelector(
    (state: RootState) => state.vehicle
  );

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

  const vehiclePathGeoJson = useMemo(() => {
    if (positionHistory.length < 2) return null;

    return {
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: positionHistory.map((pos) => [pos.longitude, pos.latitude]),
      },
    };
  }, [positionHistory]);

  // Smoothly fly to vehicle position when it updates
  useEffect(() => {
    if (currentVehicle && mapRef.current) {
      mapRef.current.flyTo({
        center: [currentVehicle.longitude, currentVehicle.latitude],
        duration: 1000,
        essential: true,
      });
    }
  }, [currentVehicle?.longitude, currentVehicle?.latitude]);

  const handleMapMove = (event: any) => {
    const { viewState } = event;
    dispatch(
      updateMapState({
        zoom: viewState.zoom,
        center: [viewState.longitude, viewState.latitude],
        bearing: viewState.bearing,
      })
    );
  };

  if (!mapboxToken) {
    return (
      <div className={styles.errorContainer}>
        <p>Mapbox token is required</p>
      </div>
    );
  }

  return (
    <div className={styles.mapContainer}>
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: center[0],
          latitude: center[1],
          zoom: zoom,
          bearing: bearing,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        onMove={handleMapMove}
        attributionControl={false}
      >
        {vehiclePathGeoJson && (
          <Source id="vehicle-path" type="geojson" data={vehiclePathGeoJson}>
            <Layer
              id="vehicle-path-layer"
              type="line"
              paint={{
                'line-color': '#52df71',
                'line-width': 4,
                'line-opacity': 0.8,
              }}
            />
          </Source>
        )}

        {pathEvents.map((event, index) => (
          <PathEventMarker
            key={`${event.type}-${event.timestamp}-${index}`}
            type={event.type}
            latitude={event.latitude}
            longitude={event.longitude}
          />
        ))}

        {currentVehicle && (
          <VehicleMarker
            latitude={currentVehicle.latitude}
            longitude={currentVehicle.longitude}
            heading={currentVehicle.heading}
            onClick={onVehicleClick}
          />
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
