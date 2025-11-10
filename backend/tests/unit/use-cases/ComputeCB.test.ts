import { ComputeCB } from '../../../src/core/use-cases/compliance/ComputeCB';
import { MockRouteRepository, MockComplianceRepository } from '../../helpers/mockRepositories';
import { createMockRoute } from '../../helpers/testData';

describe('ComputeCB Use Case', () => {
  let useCase: ComputeCB;
  let routeRepository: MockRouteRepository;
  let complianceRepository: MockComplianceRepository;

  beforeEach(() => {
    const route = createMockRoute({
      routeId: 'R001',
      ghgIntensity: 88.0,
      fuelConsumption: 4800,
    });
    
    routeRepository = new MockRouteRepository([route]);
    complianceRepository = new MockComplianceRepository();
    useCase = new ComputeCB(complianceRepository, routeRepository);
  });

  it('should compute CB for a ship', async () => {
    const result = await useCase.execute({
      shipId: 'SHIP001',
      year: 2024,
      routeId: 'R001',
    });

    expect(result.shipId).toBe('SHIP001');
    expect(result.year).toBe(2024);
    expect(result.cbGco2eq).toBeGreaterThan(0); // Should have surplus
  });

  it('should calculate surplus correctly', async () => {
    // Route with ghgIntensity = 88.0, fuelConsumption = 4800
    // Target = 89.3368
    // Energy = 4800 × 41000 = 196,800,000 MJ
    // CB = (89.3368 - 88.0) × 196,800,000 = 263,000,064
    
    const result = await useCase.execute({
      shipId: 'SHIP001',
      year: 2024,
      routeId: 'R001',
    });

    expect(result.cbGco2eq).toBeCloseTo(263_000_064, -3);
  });

  it('should update existing compliance record', async () => {
    // First computation
    await useCase.execute({
      shipId: 'SHIP001',
      year: 2024,
      routeId: 'R001',
    });

    // Second computation (should update)
    const result = await useCase.execute({
      shipId: 'SHIP001',
      year: 2024,
      routeId: 'R001',
    });

    const allRecords = await complianceRepository.findAll();
    expect(allRecords).toHaveLength(1); // Should not create duplicate
  });

  it('should throw error for non-existent route', async () => {
    await expect(
      useCase.execute({
        shipId: 'SHIP001',
        year: 2024,
        routeId: 'R999',
      })
    ).rejects.toThrow('Route R999 not found');
  });
});