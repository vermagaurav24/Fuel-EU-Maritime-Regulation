/**
 * Application Constants
 * Centralized configuration values for FuelEU compliance calculations
 */

export const FuelEUConstants = {
  /**
   * Target GHG intensity for 2025 (gCO₂e/MJ)
   * This is 2% below the 2020 baseline of 91.16
   */
  TARGET_INTENSITY_2025: 89.3368,

  /**
   * Energy content per ton of fuel (MJ/ton)
   * Standard conversion factor
   */
  ENERGY_PER_TON_FUEL: 41000,

  /**
   * Banking rules
   */
  BANKING: {
    MAX_YEARS_TO_CARRY: 3, // Maximum years to carry forward banked surplus
  },

  /**
   * Pooling rules
   */
  POOLING: {
    MIN_MEMBERS: 2, // Minimum ships required for a pool
  },
} as const;

/**
 * HTTP Status Codes
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;