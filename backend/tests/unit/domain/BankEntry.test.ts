import { BankEntry } from '../../../src/core/domain/entities/BankEntry';

describe('BankEntry Entity', () => {
  describe('Validation', () => {
    it('should create a valid bank entry', () => {
      const entry = new BankEntry(1, 'SHIP001', 2024, 1000, false);
      
      expect(entry.shipId).toBe('SHIP001');
      expect(entry.amountGco2eq).toBe(1000);
      expect(entry.isApplied).toBe(false);
    });

    it('should throw error for non-positive amount', () => {
      expect(() => {
        new BankEntry(1, 'SHIP001', 2024, -100);
      }).toThrow('Bank amount must be positive');

      expect(() => {
        new BankEntry(1, 'SHIP001', 2024, 0);
      }).toThrow('Bank amount must be positive');
    });
  });

  describe('Application Status', () => {
    it('should mark entry as applied', () => {
      const entry = new BankEntry(1, 'SHIP001', 2024, 1000, false);
      
      expect(entry.isAvailable()).toBe(true);
      entry.apply();
      expect(entry.isApplied).toBe(true);
      expect(entry.isAvailable()).toBe(false);
    });

    it('should throw error when applying already applied entry', () => {
      const entry = new BankEntry(1, 'SHIP001', 2024, 1000, false);
      
      entry.apply();
      expect(() => {
        entry.apply();
      }).toThrow('Bank entry already applied');
    });

    it('should return correct available amount', () => {
      const entry = new BankEntry(1, 'SHIP001', 2024, 1000, false);
      
      expect(entry.getAvailableAmount()).toBe(1000);
      
      entry.apply();
      expect(entry.getAvailableAmount()).toBe(0);
    });
  });
});