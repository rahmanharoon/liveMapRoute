import {
  storageKeys,
  getStoredValue,
  setStoredValue,
  removeStoredValue,
} from '@utils/localStorage';

describe('localStorage utils', () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    localStorage.clear();
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe('storageKeys', () => {
    it('should define expected keys', () => {
      expect(storageKeys.MAP_ZOOM).toBe('map_zoom');
      expect(storageKeys.MAP_CENTER).toBe('map_center');
      expect(storageKeys.MAP_BEARING).toBe('map_bearing');
    });
  });

  describe('getStoredValue', () => {
    it('should return parsed value when key exists', () => {
      localStorage.setItem('key1', JSON.stringify({ x: 1 }));
      expect(getStoredValue('key1', null)).toEqual({ x: 1 });
    });

    it('should return default when key does not exist', () => {
      expect(getStoredValue('missing', 'default')).toBe('default');
      expect(getStoredValue('missing', 42)).toBe(42);
    });

    it('should return default and log error when JSON parse fails', () => {
      localStorage.setItem('bad', 'not json');
      expect(getStoredValue('bad', null)).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reading from localStorage for key bad:',
        expect.any(Error)
      );
    });

    it('should return default when localStorage throws', () => {
      const getItem = Storage.prototype.getItem;
      Storage.prototype.getItem = jest.fn(() => {
        throw new Error('QuotaExceeded');
      });
      expect(getStoredValue('key', 'fallback')).toBe('fallback');
      expect(consoleSpy).toHaveBeenCalled();
      Storage.prototype.getItem = getItem;
    });
  });

  describe('setStoredValue', () => {
    it('should store JSON stringified value', () => {
      setStoredValue('key', { a: 1 });
      expect(localStorage.getItem('key')).toBe(JSON.stringify({ a: 1 }));
    });

    it('should log error when localStorage throws', () => {
      const setItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceeded');
      });
      setStoredValue('key', 'value');
      expect(consoleSpy).toHaveBeenCalled();
      Storage.prototype.setItem = setItem;
    });
  });

  describe('removeStoredValue', () => {
    it('should remove item', () => {
      localStorage.setItem('key', 'value');
      removeStoredValue('key');
      expect(localStorage.getItem('key')).toBeNull();
    });

    it('should log error when localStorage throws', () => {
      const removeItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = jest.fn(() => {
        throw new Error('SecurityError');
      });
      removeStoredValue('key');
      expect(consoleSpy).toHaveBeenCalled();
      Storage.prototype.removeItem = removeItem;
    });
  });
});
