/**
 * PoolMember represents a ship's participation in a pool
 */
export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

/**
 * Pool Entity
 * Represents a pooling arrangement between multiple ships
 * Following FuelEU Maritime Article 21
 */
export class Pool {
  constructor(
    public readonly id: number,
    public readonly year: number,
    public readonly members: PoolMember[]
  ) {
    this.validatePool();
  }

  /**
   * Validate pool according to FuelEU rules:
   * 1. Sum of adjusted CB must be >= 0
   * 2. Deficit ships cannot exit worse
   * 3. Surplus ships cannot exit negative
   */
  private validatePool(): void {
    if (this.members.length < 2) {
      throw new Error('Pool must have at least 2 members');
    }

    // Rule 1: Sum must be non-negative
    const totalCbBefore = this.getTotalCbBefore();
    if (totalCbBefore < 0) {
      throw new Error('Pool total CB must be non-negative');
    }

    // Rule 2 & 3: Check individual member constraints
    for (const member of this.members) {
      if (member.cbBefore < 0 && member.cbAfter < member.cbBefore) {
        throw new Error(`Deficit ship ${member.shipId} cannot exit worse`);
      }
      if (member.cbBefore > 0 && member.cbAfter < 0) {
        throw new Error(`Surplus ship ${member.shipId} cannot exit negative`);
      }
    }
  }

  /**
   * Get total CB before pooling
   */
  getTotalCbBefore(): number {
    return this.members.reduce((sum, member) => sum + member.cbBefore, 0);
  }

  /**
   * Get total CB after pooling
   */
  getTotalCbAfter(): number {
    return this.members.reduce((sum, member) => sum + member.cbAfter, 0);
  }

  /**
   * Check if pool is balanced
   * Total before should equal total after
   */
  isBalanced(): boolean {
    const before = this.getTotalCbBefore();
    const after = this.getTotalCbAfter();
    return Math.abs(before - after) < 0.01; // Allow small floating point errors
  }
}