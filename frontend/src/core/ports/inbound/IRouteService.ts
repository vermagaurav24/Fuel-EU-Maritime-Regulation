import type { RouteDTO, RouteFilterDTO } from '../../application/dto/RouteDTO';
import type { ComparisonResponseDTO } from '../../application/dto/ComparisonDTO';

/**
 * Route Service Interface (Inbound Port)
 */
export interface IRouteService {
  getAllRoutes(filter?: RouteFilterDTO): Promise<RouteDTO[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<ComparisonResponseDTO>;
}