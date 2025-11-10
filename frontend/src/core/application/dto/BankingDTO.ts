/**
 * Banking Data Transfer Objects
 */

export interface BankEntryDTO {
  id: number;
  shipId: string;
  year: number;
  amountGco2eq: number;
  isApplied: boolean;
  createdAt: string;
}

export interface BankSurplusRequestDTO {
  shipId: string;
  year: number;
  amount: number;
}

export interface ApplyBankedRequestDTO {
  shipId: string;
  year: number;
  amount: number;
}

export interface ApplyBankedResponseDTO {
  cbBefore: number;
  applied: number;
  cbAfter: number;
}

export interface BankRecordsResponseDTO {
  records: BankEntryDTO[];
  totalAvailable: number;
}