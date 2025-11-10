import { ComplianceRepository } from '../../../adapters/outbound/persistence/repositories/ComplianceRepository';
import { BankingRepository } from '../../../adapters/outbound/persistence/repositories/BankingRepository';

export class GetAdjustedCB {
  constructor(
    private complianceRepository: ComplianceRepository,
    private bankingRepository: BankingRepository
  ) {}

  async execute(vesselId: string) {
    // Example logic
    const complianceData = await this.complianceRepository.getCompliance(vesselId);
    const bankedCredits = await this.bankingRepository.getBankedCredits(vesselId);

    // Adjust compliance balance
    return complianceData.balance + bankedCredits;
  }
}
