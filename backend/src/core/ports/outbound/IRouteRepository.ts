import { Route } from '../../domain/entities/Route';

export interface RouteFilter {
  vesselType?: string;
  fuelType?: string;
  year?: number;
}

export interface IRouteRepository {
  findAll(filter?: RouteFilter): Promise<Route[]>;
  findById(id: number): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  findBaseline(): Promise<Route | null>;
  save(route: Route): Promise<Route>;
  update(route: Route): Promise<Route>;
  setBaseline(routeId: string): Promise<Route>;
}