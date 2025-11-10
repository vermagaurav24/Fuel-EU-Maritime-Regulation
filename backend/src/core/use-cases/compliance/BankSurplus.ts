import { BankEntry } from '../../domain/entities/BankEntry';
import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { IBankingRepository } from '../../ports/outbound/IBankingRepository';

export interface BankSurplusInput {
  shipId: string;
  year: number;
  amount: number;
}

/**
 * Use Case: Bank Surplus
 * Banks positive compliance balance for future use
 * Following FuelEU Maritime Article 20
 */
export class BankSurplus {
  constructor(
    private readonly complianceRepository: IComplianceRepository,
    private readonly bankingRepository: IBankingRepository
  ) {}

  async execute(input: BankSurplusInput): Promise<BankEntry> {
    // Validate ship has surplus
    const compliance = await this.complianceRepository.findByShipAndYear(
      input.shipId,
      input.year
    );

    if (!compliance) {
      throw new Error(`No compliance data found for ship ${input.shipId}`);
    }

    if (!compliance.hasSurplus()) {
      throw new Error('Cannot bank surplus: ship has deficit or zero balance');
    }

    if (input.amount > compliance.cbGco2eq) {
      throw new Error('Cannot bank more than available surplus');
    }

    if (input.amount <= 0) {
      throw new Error('Amount must be positive');
    }

    // Create bank entry
    const bankEntry = new BankEntry(
      0,
      input.shipId,
      input.year,
      input.amount,
      false
    );

    // Save bank entry
    const saved = await this.bankingRepository.save(bankEntry);

    // Update compliance balance
    compliance.updateBalance(compliance.cbGco2eq - input.amount);
    await this.complianceRepository.update(compliance);

    return saved;
  }
}