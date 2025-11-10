import { ShipCompliance } from '../../../src/core/domain/entities/ShipCompliance';

describe('ShipCompliance Entity', () => {
  describe('Surplus and Deficit Detection', () => {
    it('should detect surplus (positive CB)', () => {
      const compliance = new ShipCompliance(1, 'SHIP001', 2024, 5000);
      
      expect(compliance.hasSurplus()).toBe(true);
      expect(compliance.hasDeficit()).toBe(false);
    });

    it('should detect deficit (negative CB)', () => {
      const compliance = new ShipCompliance(1, 'SHIP001', 2024, -3000);
      
      expect(compliance.hasSurplus()).toBe(false);
      expect(compliance.hasDeficit()).toBe(true);
    });

    it('should handle zero CB', () => {
      const compliance = new ShipCompliance(1, 'SHIP001', 2024, 0);
      
      expect(compliance.hasSurplus()).toBe(false);
      expect(compliance.hasDeficit()).toBe(false);
    });
  });

  describe('Balance Management', () => {
    it('should get absolute balance value', () => {
      const surplus = new ShipCompliance(1, 'SHIP001', 2024, 5000);
      const deficit = new ShipCompliance(2, 'SHIP002', 2024, -3000);
      
      expect(surplus.getAbsoluteBalance()).toBe(5000);
      expect(deficit.getAbsoluteBalance()).toBe(3000);
    });

    it('should update balance', () => {
      const compliance = new ShipCompliance(1, 'SHIP001', 2024, 5000);
      
      compliance.updateBalance(7000);
      expect(compliance.cbGco2eq).toBe(7000);
    });
  });
});