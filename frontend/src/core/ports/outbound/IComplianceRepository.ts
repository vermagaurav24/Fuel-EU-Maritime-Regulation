import { AdjustedCBDTO } from '../../application/dto/PoolingDTO';

/**
 * Compliance Repository Interface
 * Outbound port for compliance operations
 */
export interface IComplianceRepository {
  getComplianceBalance(shipId: string, year: number, routeId: string): Promise<any>;
  getAdjustedCB(shipId: string, year: number): Promise<AdjustedCBDTO>;
}