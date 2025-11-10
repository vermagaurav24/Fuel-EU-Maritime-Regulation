/**
 * ComplianceBalance Entity
 * Represents a ship's compliance balance
 */
export class ComplianceBalance {
  constructor(
    public readonly shipId: string,
    public readonly year: number,
    public readonly cbGco2eq: number,
    public readonly originalCB?: number,
    public readonly bankedAmount?: number
  ) {}

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