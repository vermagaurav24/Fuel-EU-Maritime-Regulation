/**
 * Pooling Data Transfer Objects
 */

export interface PoolMemberDTO {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface PoolDTO {
  id: number;
  year: number;
  members: PoolMemberDTO[];
}

export interface CreatePoolRequestDTO {
  year: number;
  memberShipIds: string[];
}

export interface AdjustedCBDTO {
  shipId: string;
  year: number;
  originalCB: number;
  bankedAmount: number;
  adjustedCB: number;
}