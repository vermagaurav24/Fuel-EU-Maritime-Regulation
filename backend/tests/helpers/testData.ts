import { Route } from '../../src/core/domain/entities/Route';
import { ShipCompliance } from '../../src/core/domain/entities/ShipCompliance';
import { BankEntry } from '../../src/core/domain/entities/BankEntry';

/**
 * Test Data Factory
 * Creates mock data for testing
 */

export const createMockRoute = (overrides?: Partial<Route>): Route => {
  return new Route(
    overrides?.id ?? 1,
    overrides?.routeId ?? 'R001',
    overrides?.vesselType ?? 'Container',
    overrides?.fuelType ?? 'HFO',
    overrides?.year ?? 2024,
    overrides?.ghgIntensity ?? 91.0,
    overrides?.fuelConsumption ?? 5000,
    overrides?.distance ?? 12000,
    overrides?.totalEmissions ?? 4500,
    overrides?.isBaseline ?? false
  );
};

export const createMockShipCompliance = (
  overrides?: Partial<ShipCompliance>
): ShipCompliance => {
  return new ShipCompliance(
    overrides?.id ?? 1,
    overrides?.shipId ?? 'SHIP001',
    overrides?.year ?? 2024,
    overrides?.cbGco2eq ?? 5000
  );
};

export const createMockBankEntry = (overrides?: Partial<BankEntry>): BankEntry => {
  return new BankEntry(
    overrides?.id ?? 1,
    overrides?.shipId ?? 'SHIP001',
    overrides?.year ?? 2024,
    overrides?.amountGco2eq ?? 1000,
    overrides?.isApplied ?? false
  );
};

export const mockRoutes = [
  createMockRoute({
    id: 1,
    routeId: 'R001',
    vesselType: 'Container',
    fuelType: 'HFO',
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    isBaseline: true,
  }),
  createMockRoute({
    id: 2,
    routeId: 'R002',
    vesselType: 'BulkCarrier',
    fuelType: 'LNG',
    year: 2024,
    ghgIntensity: 88.0,
    fuelConsumption: 4800,
    isBaseline: false,
  }),
  createMockRoute({
    id: 3,
    routeId: 'R003',
    vesselType: 'Tanker',
    fuelType: 'MGO',
    year: 2024,
    ghgIntensity: 93.5,
    fuelConsumption: 5100,
    isBaseline: false,
  }),
];