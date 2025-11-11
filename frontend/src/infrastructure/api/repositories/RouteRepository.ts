import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type { IRouteRepository } from '../../../core/ports/outbound/IRouteRepository';
import type {
  RouteDTO,
  RouteFilterDTO,
  SetBaselineResponseDTO,
} from '../../../core/application/dto/RouteDTO';
import type { ComparisonResponseDTO } from '../../../core/application/dto/ComparisonDTO';
import type { ApiResponse } from '../../../shared/types';

/**
 * Route Repository Implementation
 */
export class RouteRepository implements IRouteRepository {
  async findAll(filter?: RouteFilterDTO): Promise<RouteDTO[]> {
    const response = await apiClient.get<ApiResponse<RouteDTO[]>>(ENDPOINTS.ROUTES, {
      params: filter,
    });
    return response.data.data || [];
  }

  async setBaseline(routeId: string): Promise<SetBaselineResponseDTO> {
    const response = await apiClient.post<ApiResponse<SetBaselineResponseDTO>>(
      ENDPOINTS.ROUTES_BASELINE(routeId)
    );
    return response.data.data!;
  }

  async getComparison(): Promise<ComparisonResponseDTO> {
    const response = await apiClient.get<ApiResponse<ComparisonResponseDTO>>(
      ENDPOINTS.ROUTES_COMPARISON
    );
    return response.data.data!;
  }
}
