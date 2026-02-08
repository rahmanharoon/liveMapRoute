const config = {
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN || '',
  socketServerUrl:
    import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3000',
};

export default config;
