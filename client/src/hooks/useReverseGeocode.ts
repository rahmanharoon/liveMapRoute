import { useState, useEffect } from 'react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface IGeocodeFeature {
  place_name: string;
  text?: string;
}

interface IGeocodeResponse {
  features: IGeocodeFeature[];
}

export const useReverseGeocode = (
  latitude: number | null,
  longitude: number | null
) => {
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      latitude == null ||
      longitude == null ||
      !MAPBOX_TOKEN
    ) {
      setPlaceName(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}&limit=1`;

    fetch(url)
      .then((res) => res.json())
      .then((data: IGeocodeResponse) => {
        if (cancelled) return;
        const name =
          data.features?.[0]?.place_name ?? null;
        setPlaceName(name);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to fetch location');
          setPlaceName(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude]);

  return { placeName, loading, error };
};
