import { BankEntry } from '../../domain/entities/BankEntry';

export interface IBankingRepository {
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  findAvailableByShip(shipId: string): Promise<BankEntry[]>;
  save(entry: BankEntry): Promise<BankEntry>;
  update(entry: BankEntry): Promise<BankEntry>;
  getTotalAvailable(shipId: string): Promise<number>;
}