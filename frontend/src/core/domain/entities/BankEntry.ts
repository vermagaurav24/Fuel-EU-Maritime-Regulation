/**
 * BankEntry Entity
 * Represents a banked surplus entry
 */
export class BankEntry {
  public readonly id: number;
  public readonly shipId: string;
  public readonly year: number;
  public readonly amountGco2eq: number;
  public readonly isApplied: boolean;
  public readonly createdAt: Date;

  constructor(
    id: number,
    shipId: string,
    year: number,
    amountGco2eq: number,
    isApplied: boolean,
    createdAt: Date
  ) {
    if (id <= 0) {
      throw new Error('BankEntry id must be positive');
    }
    if (!shipId || shipId.trim() === '') {
      throw new Error('shipId is required');
    }
    if (year < 2000) {
      throw new Error('Invalid year');
    }
    if (amountGco2eq <= 0) {
      throw new Error('amountGco2eq must be positive');
    }

    this.id = id;
    this.shipId = shipId;
    this.year = year;
    this.amountGco2eq = amountGco2eq;
    this.isApplied = isApplied;
    this.createdAt = createdAt;
  }

  isAvailable(): boolean {
    return !this.isApplied;
  }

  getAvailableAmount(): number {
    return this.isApplied ? 0 : this.amountGco2eq;
  }
}