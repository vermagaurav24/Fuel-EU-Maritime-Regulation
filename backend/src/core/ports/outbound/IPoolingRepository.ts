import { Pool } from '../../domain/entities/Pool';

export interface IPoolingRepository {
  save(pool: Pool): Promise<Pool>;
  findById(id: number): Promise<Pool | null>;
  findByYear(year: number): Promise<Pool[]>;
}