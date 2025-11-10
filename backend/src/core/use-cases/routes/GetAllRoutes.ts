import { Route } from '../../domain/entities/Route';
import { IRouteRepository, RouteFilter } from '../../ports/outbound/IRouteRepository';

/**
 * Use Case: Get All Routes
 * Retrieves all routes with optional filtering
 */
export class GetAllRoutes {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute(filter?: RouteFilter): Promise<Route[]> {
    return await this.routeRepository.findAll(filter);
  }
}