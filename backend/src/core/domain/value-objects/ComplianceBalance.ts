/**
 * ComplianceBalance Value Object
 * Encapsulates the calculation of compliance balance
 */
export class ComplianceBalance {
  constructor(
    public readonly targetIntensity: number,
    public readonly actualIntensity: number,
    public readonly energyInScope: number
  ) {
    if (targetIntensity <= 0 || actualIntensity <= 0 || energyInScope <= 0) {
      throw new Error('All values must be positive');
    }
  }

  /**
   * Calculate Compliance Balance (CB)
   * CB = (Target - Actual) × Energy in scope
   * 
   * Positive CB = Surplus (performing better than target)
   * Negative CB = Deficit (performing worse than target)
   */
  calculate(): number {
    return (this.targetIntensity - this.actualIntensity) * this.energyInScope;
  }

  /**
   * Check if compliant
   */
  isCompliant(): boolean {
    return this.actualIntensity <= this.targetIntensity;
  }

  /**
   * Get percentage difference from target
   */
  getPercentageDifference(): number {
    return ((this.actualIntensity / this.targetIntensity) - 1) * 100;
  }
}