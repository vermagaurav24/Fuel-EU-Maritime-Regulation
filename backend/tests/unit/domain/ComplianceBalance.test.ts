import { ComplianceBalance } from '../../../src/core/domain/value-objects/ComplianceBalance';

describe('ComplianceBalance Value Object', () => {
  describe('Validation', () => {
    it('should throw error for non-positive values', () => {
      expect(() => {
        new ComplianceBalance(-89, 91, 205000000);
      }).toThrow('All values must be positive');

      expect(() => {
        new ComplianceBalance(89, -91, 205000000);
      }).toThrow('All values must be positive');

      expect(() => {
        new ComplianceBalance(89, 91, -205000000);
      }).toThrow('All values must be positive');
    });
  });

  describe('CB Calculation', () => {
    it('should calculate positive CB (surplus)', () => {
      // Target: 89.3368, Actual: 88.0, Energy: 196,800,000 MJ
      const cb = new ComplianceBalance(89.3368, 88.0, 196_800_000);
      
      const result = cb.calculate();
      // (89.3368 - 88.0) × 196,800,000 = 263,000,064
      expect(result).toBeCloseTo(263_000_064, 0);
    });

    it('should calculate negative CB (deficit)', () => {
      // Target: 89.3368, Actual: 93.5, Energy: 209,100,000 MJ
      const cb = new ComplianceBalance(89.3368, 93.5, 209_100_000);
      
      const result = cb.calculate();
      // (89.3368 - 93.5) × 209,100,000 = -870,611,616
      expect(result).toBeCloseTo(-870_611_616, -3);
    });

    it('should calculate zero CB when actual equals target', () => {
      const cb = new ComplianceBalance(89.3368, 89.3368, 200_000_000);
      
      const result = cb.calculate();
      expect(result).toBeCloseTo(0, 2);
    });
  });

  describe('Compliance Check', () => {
    it('should return true for compliant (actual <= target)', () => {
      const cb = new ComplianceBalance(89.3368, 88.0, 200_000_000);
      expect(cb.isCompliant()).toBe(true);
    });

    it('should return false for non-compliant (actual > target)', () => {
      const cb = new ComplianceBalance(89.3368, 93.5, 200_000_000);
      expect(cb.isCompliant()).toBe(false);
    });
  });

  describe('Percentage Difference', () => {
    it('should calculate percentage difference from target', () => {
      const cb = new ComplianceBalance(89.3368, 93.5, 200_000_000);
      
      const percentDiff = cb.getPercentageDifference();
      // ((93.5 / 89.3368) - 1) × 100 = 4.66%
      expect(percentDiff).toBeCloseTo(4.66, 1);
    });

    it('should return negative percentage for better performance', () => {
      const cb = new ComplianceBalance(89.3368, 88.0, 200_000_000);
      
      const percentDiff = cb.getPercentageDifference();
      // ((88.0 / 89.3368) - 1) × 100 = -1.50%
      expect(percentDiff).toBeCloseTo(-1.50, 1);
    });
  });
});