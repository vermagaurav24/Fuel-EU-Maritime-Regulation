import { BankSurplus } from '../../../src/core/use-cases/banking/BankSurplus';
import { MockComplianceRepository, MockBankingRepository } from '../../helpers/mockRepositories';
import { createMockShipCompliance } from '../../helpers/testData';

describe('BankSurplus Use Case', () => {
  let useCase: BankSurplus;
  let complianceRepository: MockComplianceRepository;
  let bankingRepository: MockBankingRepository;

  beforeEach(() => {
    const compliance = createMockShipCompliance({
      shipId: 'SHIP001',
      year: 2024,
      cbGco2eq: 5000, // Surplus
    });
    
    complianceRepository = new MockComplianceRepository([compliance]);
    bankingRepository = new MockBankingRepository();
    useCase = new BankSurplus(complianceRepository as any, bankingRepository as any);
  });

  it('should bank surplus successfully', async () => {
    const result = await useCase.execute({
      shipId: 'SHIP001',
      year: 2024,
      amount: 2000,
    });

    expect(result.amountGco2eq).toBe(2000);
    expect(result.isApplied).toBe(false);
  });

  it('should reduce compliance balance after banking', async () => {
    await useCase.execute({
      shipId: 'SHIP001',
      year: 2024,
      amount: 2000,
    });

    const compliance = await complianceRepository.findByShipAndYear('SHIP001', 2024);
    expect(compliance?.cbGco2eq).toBe(3000); // 5000 - 2000
  });

  it('should throw error when banking from deficit', async () => {
    const deficitCompliance = createMockShipCompliance({
      shipId: 'SHIP002',
      year: 2024,
      cbGco2eq: -3000,
    });
    
    complianceRepository = new MockComplianceRepository([deficitCompliance]);
    useCase = new BankSurplus(complianceRepository as any, bankingRepository as any);

    await expect(
      useCase.execute({
        shipId: 'SHIP002',
        year: 2024,
        amount: 1000,
      })
    ).rejects.toThrow('Cannot bank surplus: ship has deficit or zero balance');
  });

  it('should throw error when banking more than available', async () => {
    await expect(
      useCase.execute({
        shipId: 'SHIP001',
        year: 2024,
        amount: 6000, // More than 5000 available
      })
    ).rejects.toThrow('Cannot bank more than available surplus');
  });

  it('should throw error for non-positive amount', async () => {
    await expect(
      useCase.execute({
        shipId: 'SHIP001',
        year: 2024,
        amount: -100,
      })
    ).rejects.toThrow('Amount must be positive');
  });
});