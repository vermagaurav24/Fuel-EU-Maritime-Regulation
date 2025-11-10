import {
  BankSurplusRequestDTO,
  ApplyBankedRequestDTO,
  ApplyBankedResponseDTO,
  BankRecordsResponseDTO,
  BankEntryDTO,
} from '../../application/dto/BankingDTO';

/**
 * Banking Repository Interface
 * Outbound port for banking operations
 */
export interface IBankingRepository {
  getRecords(shipId: string, year?: number): Promise<BankRecordsResponseDTO>;
  bankSurplus(request: BankSurplusRequestDTO): Promise<BankEntryDTO>;
  applyBanked(request: ApplyBankedRequestDTO): Promise<ApplyBankedResponseDTO>;
}