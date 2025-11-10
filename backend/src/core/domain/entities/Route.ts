/**
 * Route Entity
 * Represents a maritime route with fuel consumption and emissions data
 */
export class Route {
  constructor(
    public readonly id: number,
    public readonly routeId: string,
    public readonly vesselType: string,
    public readonly fuelType: string,
    public readonly year: number,
    public readonly ghgIntensity: number,
    public readonly fuelConsumption: number,
    public readonly distance: number,
    public readonly totalEmissions: number,
    public isBaseline: boolean = false
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.ghgIntensity <= 0) {
      throw new Error('GHG intensity must be positive');
    }
    if (this.fuelConsumption <= 0) {
      throw new Error('Fuel consumption must be positive');
    }
    if (this.distance <= 0) {
      throw new Error('Distance must be positive');
    }
  }

  /**
   * Calculate energy in scope (MJ)
   * Energy = fuelConsumption (tons) × 41,000 MJ/ton
   */
  calculateEnergyInScope(): number {
    const ENERGY_PER_TON = 41000; // MJ/ton
    return this.fuelConsumption * ENERGY_PER_TON;
  }

  /**
   * Set this route as baseline
   */
  setAsBaseline(): void {
    this.isBaseline = true;
  }

  /**
   * Remove baseline status
   */
  removeBaseline(): void {
    this.isBaseline = false;
  }
}