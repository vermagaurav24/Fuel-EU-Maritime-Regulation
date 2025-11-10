import { CreatePoolRequestDTO, PoolDTO } from '../../application/dto/PoolingDTO';

/**
 * Pooling Repository Interface
 * Outbound port for pooling operations
 */
export interface IPoolingRepository {
  createPool(request: CreatePoolRequestDTO): Promise<PoolDTO>;
  getPoolsByYear(year: number): Promise<PoolDTO[]>;
}