import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import Map, { Source, Layer, MapRef } from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from '@store/index';
import { updateMapState } from '@store/slices/mapSlice';
import VehicleMarker from './vehicleMarker';
import PathEventMarker from './pathEventMarker';
import VehiclePopup from '@components/modals/vehiclePopup';
import config from '@utils/config';

import styles from './styles.module.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxToken = config.mapboxToken;

const MapComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const mapRef = useRef<MapRef>(null);
  // state
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const { zoom, center, bearing } = useSelector((state: RootState) => state.map);
  const { currentVehicle, positionHistory, pathEvents } = useSelector(
    (state: RootState) => state.vehicle
  );

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

  const handleMapMove = useCallback((event: { viewState: { zoom: number; longitude: number; latitude: number; bearing: number } }) => {
    const { viewState } = event;
    dispatch(
      updateMapState({
        zoom: viewState.zoom,
        center: [viewState.longitude, viewState.latitude],
        bearing: viewState.bearing,
      })
    );
  }, [dispatch]);

  const handleVehicleMarkerClick = useCallback(() => {
    setIsPopupOpen((prev) => !prev);
  }, []);

  const initialViewState = useMemo(
    () => ({
      longitude: center[0],
      latitude: center[1],
      zoom,
      bearing,
    }),
    [center, zoom, bearing]
  );

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
        initialViewState={initialViewState}
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
            onClick={handleVehicleMarkerClick}
          />
        )}
      </Map>
      <VehiclePopup isOpen={isPopupOpen && !!currentVehicle} />
    </div>
  );
};

export default MapComponent;
