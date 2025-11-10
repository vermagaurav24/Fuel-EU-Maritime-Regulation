import { Route } from '../../../src/core/domain/entities/Route';

describe('Route Entity', () => {
  describe('Constructor and Validation', () => {
    it('should create a valid route', () => {
      const route = new Route(
        1,
        'R001',
        'Container',
        'HFO',
        2024,
        91.0,
        5000,
        12000,
        4500,
        false
      );

      expect(route.routeId).toBe('R001');
      expect(route.vesselType).toBe('Container');
      expect(route.ghgIntensity).toBe(91.0);
    });

    it('should throw error for negative GHG intensity', () => {
      expect(() => {
        new Route(1, 'R001', 'Container', 'HFO', 2024, -91.0, 5000, 12000, 4500);
      }).toThrow('GHG intensity must be positive');
    });

    it('should throw error for negative fuel consumption', () => {
      expect(() => {
        new Route(1, 'R001', 'Container', 'HFO', 2024, 91.0, -5000, 12000, 4500);
      }).toThrow('Fuel consumption must be positive');
    });

    it('should throw error for negative distance', () => {
      expect(() => {
        new Route(1, 'R001', 'Container', 'HFO', 2024, 91.0, 5000, -12000, 4500);
      }).toThrow('Distance must be positive');
    });
  });

  describe('Energy Calculation', () => {
    it('should calculate energy in scope correctly', () => {
      const route = new Route(
        1,
        'R001',
        'Container',
        'HFO',
        2024,
        91.0,
        5000,
        12000,
        4500
      );

      const energy = route.calculateEnergyInScope();
      // 5000 tons × 41,000 MJ/ton = 205,000,000 MJ
      expect(energy).toBe(205_000_000);
    });
  });

  describe('Baseline Management', () => {
    it('should set route as baseline', () => {
      const route = new Route(
        1,
        'R001',
        'Container',
        'HFO',
        2024,
        91.0,
        5000,
        12000,
        4500,
        false
      );

      expect(route.isBaseline).toBe(false);
      route.setAsBaseline();
      expect(route.isBaseline).toBe(true);
    });

    it('should remove baseline status', () => {
      const route = new Route(
        1,
        'R001',
        'Container',
        'HFO',
        2024,
        91.0,
        5000,
        12000,
        4500,
        true
      );

      expect(route.isBaseline).toBe(true);
      route.removeBaseline();
      expect(route.isBaseline).toBe(false);
    });
  });
});