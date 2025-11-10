/**
 * Route Entity
 * Represents a maritime route with emissions data
 */
export class Route {
  public readonly id: number;
  public readonly routeId: string;
  public readonly vesselType: string;
  public readonly fuelType: string;
  public readonly year: number;
  public readonly ghgIntensity: number;
  public readonly fuelConsumption: number;
  public readonly distance: number;
  public readonly totalEmissions: number;
  public readonly isBaseline: boolean;

  constructor(
    id: number,
    routeId: string,
    vesselType: string,
    fuelType: string,
    year: number,
    ghgIntensity: number,
    fuelConsumption: number,
    distance: number,
    totalEmissions: number,
    isBaseline: boolean = false
  ) {
    this.id = id;
    this.routeId = routeId;
    this.vesselType = vesselType;
    this.fuelType = fuelType;
    this.year = year;
    this.ghgIntensity = ghgIntensity;
    this.fuelConsumption = fuelConsumption;
    this.distance = distance;
    this.totalEmissions = totalEmissions;
    this.isBaseline = isBaseline;
  }

  /**
   * Check if route is compliant with target
   */
  isCompliant(targetIntensity: number): boolean {
    return this.ghgIntensity <= targetIntensity;
  }

  /**
   * Calculate percentage difference from target
   */
  percentageDifferenceFrom(targetIntensity: number): number {
    return ((this.ghgIntensity / targetIntensity) - 1) * 100;
  }
}