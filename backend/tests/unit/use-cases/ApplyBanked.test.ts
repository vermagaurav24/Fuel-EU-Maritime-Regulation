import { ApplyBanked } from '../../../src/core/use-cases/banking/ApplyBanked';
import { MockComplianceRepository, MockBankingRepository } from '../../helpers/mockRepositories';
import { createMockShipCompliance, createMockBankEntry } from '../../helpers/testData';

describe('ApplyBanked Use Case', () => {
  let useCase: ApplyBanked;
  let complianceRepository: MockComplianceRepository;
  let bankingRepository: MockBankingRepository;

  beforeEach(() => {
    const compliance = createMockShipCompliance({
      shipId: 'SHIP001',
      year: 2025,
      cbGco2eq: -2000, // Deficit
    });

    const bankEntry = createMockBankEntry({
      shipId: 'SHIP001',
      year: 2024,
      amountGco2eq: 3000,
      isApplied: false,
    });
    
    complianceRepository = new MockComplianceRepository([compliance]);
    bankingRepository = new MockBankingRepository([bankEntry]);
    useCase = new ApplyBanked(complianceRepository, bankingRepository);
  });

  it('should apply banked surplus to deficit', async () => {
    const result = await useCase.execute({
      shipId: 'SHIP001',
      year: 2025,
      amount: 1500,
    });

    expect(result.cbBefore).toBe(-2000);
    expect(result.applied).toBe(1500);
    expect(result.cbAfter).toBe(-500); // -2000 + 1500
  });

  it('should mark bank entry as applied', async () => {
    await useCase.execute({
      shipId: 'SHIP001',
      year: 2025,
      amount: 1500,
    });

    const entries = await bankingRepository.findByShipAndYear('SHIP001', 2024);
    expect(entries[0].isApplied).toBe(true);
  });

  it('should throw error when insufficient banked amount', async () => {
    await expect(
      useCase.execute({
        shipId: 'SHIP001',
        year: 2025,
        amount: 5000, // More than 3000 available
      })
    ).rejects.toThrow('Insufficient banked amount');
  });

  it('should throw error for non-existent compliance', async () => {
    await expect(
      useCase.execute({
        shipId: 'SHIP999',
        year: 2025,
        amount: 1000,
      })
    ).rejects.toThrow('No compliance data found');
  });

  it('should throw error for non-positive amount', async () => {
    await expect(
      useCase.execute({
        shipId: 'SHIP001',
        year: 2025,
        amount: 0,
      })
    ).rejects.toThrow('Amount must be positive');
  });
});