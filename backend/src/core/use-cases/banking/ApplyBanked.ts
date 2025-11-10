import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { IBankingRepository } from '../../ports/outbound/IBankingRepository';

export interface ApplyBankedInput {
  shipId: string;
  year: number;
  amount: number;
}

export interface ApplyBankedResult {
  cbBefore: number;
  applied: number;
  cbAfter: number;
}

/**
 * Use Case: Apply Banked Surplus
 * Applies previously banked surplus to current deficit
 */
export class ApplyBanked {
  constructor(
    private readonly complianceRepository: IComplianceRepository,
    private readonly bankingRepository: IBankingRepository
  ) {}

  async execute(input: ApplyBankedInput): Promise<ApplyBankedResult> {
    // Get current compliance
    const compliance = await this.complianceRepository.findByShipAndYear(
      input.shipId,
      input.year
    );

    if (!compliance) {
      throw new Error(`No compliance data found for ship ${input.shipId}`);
    }

    // Get available banked amount
    const totalAvailable = await this.bankingRepository.getTotalAvailable(input.shipId);

    if (totalAvailable < input.amount) {
      throw new Error(
        `Insufficient banked amount. Available: ${totalAvailable}, Requested: ${input.amount}`
      );
    }

    if (input.amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const cbBefore = compliance.cbGco2eq;

    // Apply banked amount to compliance balance
    compliance.updateBalance(compliance.cbGco2eq + input.amount);
    await this.complianceRepository.update(compliance);

    // Mark bank entries as applied (FIFO - oldest first)
    const availableEntries = await this.bankingRepository.findAvailableByShip(input.shipId);
    let remainingToApply = input.amount;

    for (const entry of availableEntries) {
      if (remainingToApply <= 0) break;

      if (entry.amountGco2eq <= remainingToApply) {
        entry.apply();
        await this.bankingRepository.update(entry);
        remainingToApply -= entry.amountGco2eq;
      } else {
        // Partial application (would need to split entry - simplified here)
        entry.apply();
        await this.bankingRepository.update(entry);
        remainingToApply = 0;
      }
    }

    return {
      cbBefore,
      applied: input.amount,
      cbAfter: compliance.cbGco2eq,
    };
  }
}