/**
 * Application Constants
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
};

export const FUELEU_CONSTANTS = {
  TARGET_INTENSITY_2025: 89.3368,
  ENERGY_PER_TON_FUEL: 41000,
};

export const VESSEL_TYPES = [
  'Container',
  'BulkCarrier',
  'Tanker',
  'RoRo',
] as const;

export const FUEL_TYPES = [
  'HFO',
  'LNG',
  'MGO',
] as const;

export const YEARS = [2024, 2025, 2026] as const;