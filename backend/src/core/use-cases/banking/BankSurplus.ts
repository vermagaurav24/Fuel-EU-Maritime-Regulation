import { ComplianceRepository } from '../../../adapters/outbound/persistence/repositories/ComplianceRepository';
import { BankingRepository } from '../../../adapters/outbound/persistence/repositories/BankingRepository';

interface BankSurplusInput {
  shipId: string;
  year: number;
  amount: number;
}

export class BankSurplus {
  constructor(
    private complianceRepository: ComplianceRepository,
    private bankingRepository: BankingRepository
  ) {}

  async execute({ shipId, year, amount }: BankSurplusInput) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const compliance = await this.complianceRepository.findByShipAndYear(shipId, year);
    if (!compliance) {
      throw new Error('Compliance record not found');
    }

    if (compliance.cbGco2eq <= 0) {
      throw new Error('Cannot bank surplus: ship has deficit or zero balance');
    }

    if (amount > compliance.cbGco2eq) {
      throw new Error('Cannot bank more than available surplus');
    }

    // Reduce compliance balance
    compliance.cbGco2eq -= amount;
    await (this.complianceRepository as any).updateCompliance?.(compliance);

    // Add to bank
    const bankRecord = await this.bankingRepository.addToBank(shipId, amount);

    return bankRecord;
  }
}
