/**
 * GhgIntensity Value Object
 * Represents greenhouse gas intensity in gCO₂e/MJ
 */
export class GhgIntensity {
  constructor(public readonly value: number) {
    if (value <= 0) {
      throw new Error('GHG intensity must be positive');
    }
  }

  /**
   * Compare with another intensity
   */
  compareTo(other: GhgIntensity): number {
    return this.value - other.value;
  }

  /**
   * Calculate percentage difference
   */
  percentageDifferenceFrom(baseline: GhgIntensity): number {
    return ((this.value / baseline.value) - 1) * 100;
  }

  /**
   * Check if better than (lower than) another intensity
   */
  isBetterThan(other: GhgIntensity): boolean {
    return this.value < other.value;
  }
}