import { RouteDTO, RouteFilterDTO, SetBaselineResponseDTO } from '../../application/dto/RouteDTO';
import { ComparisonResponseDTO } from '../../application/dto/ComparisonDTO';

/**
 * Route Repository Interface
 * Outbound port for route data operations
 */
export interface IRouteRepository {
  findAll(filter?: RouteFilterDTO): Promise<RouteDTO[]>;
  setBaseline(routeId: string): Promise<SetBaselineResponseDTO>;
  getComparison(): Promise<ComparisonResponseDTO>;
}