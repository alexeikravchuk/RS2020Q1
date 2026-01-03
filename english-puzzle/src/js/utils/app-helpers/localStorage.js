export default class LocalStorage {
  static get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) {
        return defaultValue;
      }
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  static set(key, value) {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  }

  static getBoolean(key, defaultValue = false) {
    const value = this.get(key, defaultValue);
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      return value === 'true';
    }
    return Boolean(value);
  }

  static getNumber(key, defaultValue = 0) {
    const value = this.get(key, defaultValue);
    if (typeof value === 'number') {
      return value;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }
}

