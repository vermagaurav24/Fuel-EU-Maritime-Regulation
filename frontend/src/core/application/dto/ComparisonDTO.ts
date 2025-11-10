import type { RouteDTO } from './RouteDTO';

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

// Export all types together for convenience
export type { RouteDTO } from './RouteDTO';
export type { RouteFilterDTO, SetBaselineResponseDTO } from './RouteDTO';