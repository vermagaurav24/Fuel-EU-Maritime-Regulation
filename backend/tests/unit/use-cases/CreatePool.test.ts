import { CreatePool } from '../../../src/core/use-cases/pooling/CreatePool';
import { MockPoolingRepository, MockComplianceRepository } from '../../helpers/mockRepositories';
import { createMockShipCompliance } from '../../helpers/testData';

describe('CreatePool Use Case', () => {
  let useCase: CreatePool;
  let poolingRepository: MockPoolingRepository;
  let complianceRepository: MockComplianceRepository;

  beforeEach(() => {
    const compliances = [
      createMockShipCompliance({ shipId: 'SHIP001', year: 2024, cbGco2eq: 5000 }),
      createMockShipCompliance({ shipId: 'SHIP002', year: 2024, cbGco2eq: -3000 }),
    ];
    
    complianceRepository = new MockComplianceRepository(compliances);
    poolingRepository = new MockPoolingRepository();
    useCase = new CreatePool(poolingRepository, complianceRepository);
  });

  it('should create a valid pool', async () => {
    const pool = await useCase.execute({
      year: 2024,
      memberShipIds: ['SHIP001', 'SHIP002'],
    });

    expect(pool.members).toHaveLength(2);
    expect(pool.year).toBe(2024);
  });

  it('should allocate balances correctly (greedy algorithm)', async () => {
    const pool = await useCase.execute({
      year: 2024,
      memberShipIds: ['SHIP001', 'SHIP002'],
    });

    const ship001 = pool.members.find(m => m.shipId === 'SHIP001');
    const ship002 = pool.members.find(m => m.shipId === 'SHIP002');

    expect(ship001?.cbBefore).toBe(5000);
    expect(ship002?.cbBefore).toBe(-3000);
    
    // After pooling, deficit should improve
    if (ship002?.cbAfter !== undefined && ship002?.cbBefore !== undefined) {
    expect(ship002.cbAfter).toBeGreaterThan(ship002.cbBefore);
    } else {
        throw new Error('cbAfter or cbBefore is undefined');
    }
  });

  it('should throw error for less than 2 members', async () => {
    await expect(
      useCase.execute({
        year: 2024,
        memberShipIds: ['SHIP001'],
      })
    ).rejects.toThrow('Pool must have at least 2 members');
  });

  it('should throw error if total CB is negative', async () => {
    const compliances = [
      createMockShipCompliance({ shipId: 'SHIP003', year: 2024, cbGco2eq: -5000 }),
      createMockShipCompliance({ shipId: 'SHIP004', year: 2024, cbGco2eq: -3000 }),
    ];
    
    complianceRepository = new MockComplianceRepository(compliances);
    useCase = new CreatePool(poolingRepository, complianceRepository);

    await expect(
      useCase.execute({
        year: 2024,
        memberShipIds: ['SHIP003', 'SHIP004'],
      })
    ).rejects.toThrow('Pool total CB must be non-negative');
  });

  it('should throw error for non-existent ship', async () => {
    await expect(
      useCase.execute({
        year: 2024,
        memberShipIds: ['SHIP001', 'SHIP999'],
      })
    ).rejects.toThrow('No compliance data for ship SHIP999');
  });
});