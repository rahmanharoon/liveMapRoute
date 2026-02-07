/**
 * LocalStorage utility functions for persisting map state
 */

export const storageKeys = {
  MAP_ZOOM: 'map_zoom',
  MAP_CENTER: 'map_center',
  MAP_BEARING: 'map_bearing',
} as const;

export const getStoredValue = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return defaultValue;
  }
};

export const setStoredValue = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage for key ${key}:`, error);
  }
};

export const removeStoredValue = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage for key ${key}:`, error);
  }
};
