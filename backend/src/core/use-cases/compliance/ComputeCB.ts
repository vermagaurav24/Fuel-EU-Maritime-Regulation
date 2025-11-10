import { ShipCompliance } from '../../domain/entities/ShipCompliance';
import { ComplianceBalance } from '../../domain/value-objects/ComplianceBalance';
import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { IRouteRepository } from '../../ports/outbound/IRouteRepository';

export interface ComputeCBInput {
  shipId: string;
  year: number;
  routeId: string;
}

/**
 * Use Case: Compute Compliance Balance
 * Calculates and stores CB for a ship based on route data
 */
export class ComputeCB {
  private readonly TARGET_INTENSITY = 89.3368;

  constructor(
    private readonly complianceRepository: IComplianceRepository,
    private readonly routeRepository: IRouteRepository
  ) {}

  async execute(input: ComputeCBInput): Promise<ShipCompliance> {
    // Get route data
    const route = await this.routeRepository.findByRouteId(input.routeId);
    if (!route) {
      throw new Error(`Route ${input.routeId} not found`);
    }

    // Calculate energy in scope
    const energyInScope = route.calculateEnergyInScope();

    // Create compliance balance value object
    const cb = new ComplianceBalance(
      this.TARGET_INTENSITY,
      route.ghgIntensity,
      energyInScope
    );

    // Calculate CB value
    const cbValue = cb.calculate();

    // Check if compliance record exists
    let compliance = await this.complianceRepository.findByShipAndYear(
      input.shipId,
      input.year
    );

    if (compliance) {
      // Update existing
      compliance.updateBalance(cbValue);
      return await this.complianceRepository.update(compliance);
    } else {
      // Create new
      compliance = new ShipCompliance(0, input.shipId, input.year, cbValue);
      return await this.complianceRepository.save(compliance);
    }
  }
}