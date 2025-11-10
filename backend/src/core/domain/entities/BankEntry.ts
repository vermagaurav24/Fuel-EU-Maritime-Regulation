/**
 * BankEntry Entity
 * Represents a banked surplus amount for a ship
 */
export class BankEntry {
  constructor(
    public readonly id: number,
    public readonly shipId: string,
    public readonly year: number,
    public amountGco2eq: number,
    public isApplied: boolean = false
  ) {
    if (amountGco2eq <= 0) {
      throw new Error('Bank amount must be positive');
    }
  }

  /**
   * Apply banked amount (mark as used)
   */
  apply(): void {
    if (this.isApplied) {
      throw new Error('Bank entry already applied');
    }
    this.isApplied = true;
  }

  /**
   * Check if entry is available for use
   */
  isAvailable(): boolean {
    return !this.isApplied;
  }

  /**
   * Get available amount
   */
  getAvailableAmount(): number {
    return this.isApplied ? 0 : this.amountGco2eq;
  }
}