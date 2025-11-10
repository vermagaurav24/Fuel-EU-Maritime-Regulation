/**
 * ShipCompliance Entity
 * Represents compliance balance for a ship in a given year
 */
export class ShipCompliance {
  constructor(
    public readonly id: number,
    public readonly shipId: string,
    public readonly year: number,
    public cbGco2eq: number
  ) {}

  /**
   * Check if ship has surplus (positive CB)
   */
  hasSurplus(): boolean {
    return this.cbGco2eq > 0;
  }

  /**
   * Check if ship has deficit (negative CB)
   */
  hasDeficit(): boolean {
    return this.cbGco2eq < 0;
  }

  /**
   * Get absolute value of CB
   */
  getAbsoluteBalance(): number {
    return Math.abs(this.cbGco2eq);
  }

  /**
   * Update compliance balance
   */
  updateBalance(newBalance: number): void {
    this.cbGco2eq = newBalance;
  }
}