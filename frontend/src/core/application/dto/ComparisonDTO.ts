import { RouteDTO } from './RouteDTO';

/**
 * Comparison Data Transfer Objects
 */

export interface ComparisonItemDTO {
  route: RouteDTO;
  percentDiff: number;
  compliant: boolean;
}

export interface ComparisonResponseDTO {
  baseline: RouteDTO;
  comparisons: ComparisonItemDTO[];
  targetIntensity: number;
}