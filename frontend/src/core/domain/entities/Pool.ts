/**
 * PoolMember interface
 */
export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

/**
 * Pool Entity
 * Represents a pooling arrangement
 */
export class Pool {
  public readonly id: number;
  public readonly year: number;
  public readonly members: PoolMember[];

  constructor(
    id: number,
    year: number,
    members: PoolMember[]
  ) {
    if (id <= 0) {
      throw new Error('Pool id must be positive');
    }
    if (year < 2000) {
      throw new Error('Invalid year');
    }
    if (!members || members.length === 0) {
      throw new Error('Pool must have at least one member');
    }

    this.id = id;
    this.year = year;
    this.members = members;
  }

  getTotalCbBefore(): number {
    return this.members.reduce((sum: number, m: PoolMember) => sum + m.cbBefore, 0);
  }

  getTotalCbAfter(): number {
    return this.members.reduce((sum: number, m: PoolMember) => sum + m.cbAfter, 0);
  }

  isValid(): boolean {
    return this.getTotalCbBefore() >= 0;
  }

  isBalanced(): boolean {
    const before: number = this.getTotalCbBefore();
    const after: number = this.getTotalCbAfter();
    return Math.abs(before - after) < 0.01;
  }
}