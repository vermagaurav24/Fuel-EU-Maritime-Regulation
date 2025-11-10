import { ShipCompliance } from '../../domain/entities/ShipCompliance';

export interface IComplianceRepository {
  findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null>;
  save(compliance: ShipCompliance): Promise<ShipCompliance>;
  update(compliance: ShipCompliance): Promise<ShipCompliance>;
  findAll(): Promise<ShipCompliance[]>;
}