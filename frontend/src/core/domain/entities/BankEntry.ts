/**
 * BankEntry Entity
 * Represents a banked surplus entry
 */
export class BankEntry {
  constructor(
    public readonly id: number,
    public readonly shipId: string,
    public readonly year: number,
    public readonly amountGco2eq: number,
    public readonly isApplied: boolean,
    public readonly createdAt: Date
  ) {}

  isAvailable(): boolean {
    return !this.isApplied;
  }

  getAvailableAmount(): number {
    return this.isApplied ? 0 : this.amountGco2eq;
  }
}