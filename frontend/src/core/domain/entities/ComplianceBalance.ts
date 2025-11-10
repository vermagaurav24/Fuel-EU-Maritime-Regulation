/**
 * ComplianceBalance Entity
 * Represents a ship's compliance balance
 */
export class ComplianceBalance {
  public readonly shipId: string;
  public readonly year: number;
  public readonly cbGco2eq: number;
  public readonly originalCB?: number;
  public readonly bankedAmount?: number;

  constructor(
    shipId: string,
    year: number,
    cbGco2eq: number,
    originalCB?: number,
    bankedAmount?: number
  ) {
    if (!shipId || shipId.trim() === '') {
      throw new Error('shipId is required');
    }
    if (year < 2000) {
      throw new Error('Invalid year');
    }

    this.shipId = shipId;
    this.year = year;
    this.cbGco2eq = cbGco2eq;
    this.originalCB = originalCB;
    this.bankedAmount = bankedAmount;
  }

  hasSurplus(): boolean {
    return this.cbGco2eq > 0;
  }

  hasDeficit(): boolean {
    return this.cbGco2eq < 0;
  }

  getAbsoluteValue(): number {
    return Math.abs(this.cbGco2eq);
  }

  getStatus(): 'surplus' | 'deficit' | 'neutral' {
    if (this.cbGco2eq > 0) return 'surplus';
    if (this.cbGco2eq < 0) return 'deficit';
    return 'neutral';
  }
}