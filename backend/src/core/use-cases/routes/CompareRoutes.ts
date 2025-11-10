import { Route } from '../../domain/entities/Route';
import { GhgIntensity } from '../../domain/value-objects/GhgIntensity';
import { IRouteRepository } from '../../ports/outbound/IRouteRepository';

export interface ComparisonResult {
  baseline: Route;
  comparisons: Array<{
    route: Route;
    percentDiff: number;
    compliant: boolean;
  }>;
  targetIntensity: number;
}

/**
 * Use Case: Compare Routes
 * Compares all routes against the baseline
 */
export class CompareRoutes {
  private readonly TARGET_INTENSITY = 89.3368; // 2% below 91.16

  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute(): Promise<ComparisonResult> {
    // Get baseline route
    const baseline = await this.routeRepository.findBaseline();
    if (!baseline) {
      throw new Error('No baseline route set');
    }

    // Get all routes
    const allRoutes = await this.routeRepository.findAll();
    
    // Filter out baseline from comparisons
    const routesToCompare = allRoutes.filter(r => r.routeId !== baseline.routeId);

    // Calculate comparisons
    const baselineIntensity = new GhgIntensity(baseline.ghgIntensity);
    
    const comparisons = routesToCompare.map(route => {
      const routeIntensity = new GhgIntensity(route.ghgIntensity);
      const percentDiff = routeIntensity.percentageDifferenceFrom(baselineIntensity);
      const compliant = route.ghgIntensity <= this.TARGET_INTENSITY;

      return {
        route,
        percentDiff,
        compliant,
      };
    });

    return {
      baseline,
      comparisons,
      targetIntensity: this.TARGET_INTENSITY,
    };
  }
}