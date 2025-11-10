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
  constructor(
    public readonly id: number,
    public readonly year: number,
    public readonly members: PoolMember[]
  ) {}

  getTotalCbBefore(): number {
    return this.members.reduce((sum, m) => sum + m.cbBefore, 0);
  }

  getTotalCbAfter(): number {
    return this.members.reduce((sum, m) => sum + m.cbAfter, 0);
  }

  isValid(): boolean {
    return this.getTotalCbBefore() >= 0;
  }

  isBalanced(): boolean {
    const before = this.getTotalCbBefore();
    const after = this.getTotalCbAfter();
    return Math.abs(before - after) < 0.01;
  }
}