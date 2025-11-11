import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type { IBankingRepository } from '../../../core/ports/outbound/IBankingRepository';
import type {
  BankSurplusRequestDTO,
  ApplyBankedRequestDTO,
  ApplyBankedResponseDTO,
  BankRecordsResponseDTO,
  BankEntryDTO,
} from '../../../core/application/dto/BankingDTO';
import type { ApiResponse } from '../../../shared/types';

/**
 * Banking Repository Implementation
 */
export class BankingRepository implements IBankingRepository {
  async getRecords(shipId: string, year?: number): Promise<BankRecordsResponseDTO> {
    const response = await apiClient.get<ApiResponse<BankRecordsResponseDTO>>(
      ENDPOINTS.BANKING_RECORDS,
      {
        params: { shipId, year },
      }
    );
    return response.data.data!;
  }

  async bankSurplus(request: BankSurplusRequestDTO): Promise<BankEntryDTO> {
    const response = await apiClient.post<ApiResponse<BankEntryDTO>>(
      ENDPOINTS.BANKING_BANK,
      request
    );
    return response.data.data!;
  }

  async applyBanked(request: ApplyBankedRequestDTO): Promise<ApplyBankedResponseDTO> {
    const response = await apiClient.post<ApiResponse<ApplyBankedResponseDTO>>(
      ENDPOINTS.BANKING_APPLY,
      request
    );
    return response.data.data!;
  }
}