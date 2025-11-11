
export class GhgIntensity {
  public readonly value: number;

  constructor(value: number) {
    if (value <= 0) {
      throw new Error('GHG intensity must be positive');
    }
    this.value = value;
  }

  compareTo(other: GhgIntensity): number {
    return this.value - other.value;
  }

  percentageDifferenceFrom(baseline: GhgIntensity): number {
    return ((this.value / baseline.value) - 1) * 100;
  }

  isBetterThan(other: GhgIntensity): boolean {
    return this.value < other.value;
  }

  isCompliantWith(target: GhgIntensity): boolean {
    return this.value <= target.value;
  }
}
