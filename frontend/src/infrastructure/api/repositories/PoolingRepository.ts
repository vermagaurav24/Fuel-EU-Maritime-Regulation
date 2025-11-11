import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type { IPoolingRepository } from '../../../core/ports/outbound/IPoolingRepository';
import type { CreatePoolRequestDTO, PoolDTO } from '../../../core/application/dto/PoolingDTO';
import type { ApiResponse } from '../../../shared/types';

/**
 * Pooling Repository Implementation
 */
export class PoolingRepository implements IPoolingRepository {
  async createPool(request: CreatePoolRequestDTO): Promise<PoolDTO> {
    const response = await apiClient.post<ApiResponse<PoolDTO>>(ENDPOINTS.POOLS, request);
    return response.data.data!;
  }

  async getPoolsByYear(year: number): Promise<PoolDTO[]> {
    const response = await apiClient.get<ApiResponse<PoolDTO[]>>(ENDPOINTS.POOLS, {
      params: { year },
    });
    return response.data.data ?? [];
  }
}