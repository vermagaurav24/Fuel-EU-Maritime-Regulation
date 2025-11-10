import { Pool, PoolMember } from '../../../src/core/domain/entities/Pool';

describe('Pool Entity', () => {
  describe('Validation', () => {
    it('should create a valid pool', () => {
      const members: PoolMember[] = [
        { shipId: 'SHIP001', cbBefore: 5000, cbAfter: 2000 },
        { shipId: 'SHIP002', cbBefore: -3000, cbAfter: 0 },
      ];

      const pool = new Pool(1, 2024, members);
      
      expect(pool.members.length).toBe(2);
      expect(pool.year).toBe(2024);
    });

    it('should throw error for less than 2 members', () => {
      const members: PoolMember[] = [
        { shipId: 'SHIP001', cbBefore: 5000, cbAfter: 5000 },
      ];

      expect(() => {
        new Pool(1, 2024, members);
      }).toThrow('Pool must have at least 2 members');
    });

    it('should throw error if total CB is negative', () => {
      const members: PoolMember[] = [
        { shipId: 'SHIP001', cbBefore: 1000, cbAfter: 0 },
        { shipId: 'SHIP002', cbBefore: -3000, cbAfter: -2000 },
      ];

      expect(() => {
        new Pool(1, 2024, members);
      }).toThrow('Pool total CB must be non-negative');
    });

    it('should throw error if deficit ship exits worse', () => {
      const members: PoolMember[] = [
        { shipId: 'SHIP001', cbBefore: 5000, cbAfter: 3000 },
        { shipId: 'SHIP002', cbBefore: -2000, cbAfter: -3000 }, // Getting worse!
      ];

      expect(() => {
        new Pool(1, 2024, members);
      }).toThrow('Deficit ship SHIP002 cannot exit worse');
    });

    it('should throw error if surplus ship exits negative', () => {
      const members: PoolMember[] = [
        { shipId: 'SHIP001', cbBefore: 2000, cbAfter: -500 }, // Going negative!
        { shipId: 'SHIP002', cbBefore: -1000, cbAfter: 500 },
      ];

      expect(() => {
        new Pool(1, 2024, members);
      }).toThrow('Surplus ship SHIP001 cannot exit negative');
    });
  });

  describe('Balance Calculations', () => {
    it('should calculate total CB before pooling', () => {
      const members: PoolMember[] = [
        { shipId: 'SHIP001', cbBefore: 5000, cbAfter: 2000 },
        { shipId: 'SHIP002', cbBefore: -3000, cbAfter: 0 },
      ];

      const pool = new Pool(1, 2024, members);
      expect(pool.getTotalCbBefore()).toBe(2000); // 5000 + (-3000)
    });

    it('should calculate total CB after pooling', () => {
      const members: PoolMember[] = [
        { shipId: 'SHIP001', cbBefore: 5000, cbAfter: 2000 },
        { shipId: 'SHIP002', cbBefore: -3000, cbAfter: 0 },
      ];

      const pool = new Pool(1, 2024, members);
      expect(pool.getTotalCbAfter()).toBe(2000); // 2000 + 0
    });

    it('should check if pool is balanced', () => {
      const members: PoolMember[] = [
        { shipId: 'SHIP001', cbBefore: 5000, cbAfter: 2000 },
        { shipId: 'SHIP002', cbBefore: -3000, cbAfter: 0 },
      ];

      const pool = new Pool(1, 2024, members);
      expect(pool.isBalanced()).toBe(true);
    });
  });
});