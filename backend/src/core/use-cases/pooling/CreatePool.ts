import { Pool, PoolMember } from '../../domain/entities/Pool';
import { IPoolingRepository } from '../../ports/outbound/IPoolingRepository';
import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';

export interface CreatePoolInput {
  year: number;
  memberShipIds: string[];
}

/**
 * Use Case: Create Pool
 * Creates a pooling arrangement between ships
 * Following FuelEU Maritime Article 21
 * 
 * Algorithm: Greedy allocation
 * 1. Sort members by CB (descending)
 * 2. Transfer surplus from positive ships to negative ships
 * 3. Validate all constraints
 */
export class CreatePool {
  constructor(
    private readonly poolingRepository: IPoolingRepository,
    private readonly complianceRepository: IComplianceRepository
  ) {}

  async execute(input: CreatePoolInput): Promise<Pool> {
    if (input.memberShipIds.length < 2) {
      throw new Error('Pool must have at least 2 members');
    }

    // Get compliance data for all members
    const membersData = await Promise.all(
      input.memberShipIds.map(async (shipId) => {
        const compliance = await this.complianceRepository.findByShipAndYear(
          shipId,
          input.year
        );
        if (!compliance) {
          throw new Error(`No compliance data for ship ${shipId} in year ${input.year}`);
        }
        return {
          shipId,
          cbBefore: compliance.cbGco2eq,
          cbAfter: compliance.cbGco2eq, // Will be calculated
        };
      })
    );

    // Check if total CB is non-negative
    const totalCB = membersData.reduce((sum, m) => sum + m.cbBefore, 0);
    if (totalCB < 0) {
      throw new Error('Pool total CB must be non-negative');
    }

    // Greedy allocation algorithm
    const members = this.allocatePoolBalances(membersData);

    // Create and validate pool
    const pool = new Pool(0, input.year, members);

    // Save pool
    return await this.poolingRepository.save(pool);
  }

  /**
   * Greedy allocation algorithm
   * Transfers surplus from ships with positive CB to ships with negative CB
   */
  private allocatePoolBalances(members: PoolMember[]): PoolMember[] {
    // Sort by CB descending (surplus ships first)
    const sorted = [...members].sort((a, b) => b.cbBefore - a.cbBefore);

    // Separate into surplus and deficit
    const surplus = sorted.filter(m => m.cbBefore > 0);
    const deficit = sorted.filter(m => m.cbBefore < 0);

    // Initialize cbAfter
    sorted.forEach(m => {
      m.cbAfter = m.cbBefore;
    });

    // Transfer from surplus to deficit
    for (const deficitShip of deficit) {
      let needed = Math.abs(deficitShip.cbAfter);

      for (const surplusShip of surplus) {
        if (needed <= 0) break;
        if (surplusShip.cbAfter <= 0) continue;

        const available = surplusShip.cbAfter;
        const transfer = Math.min(available, needed);

        surplusShip.cbAfter -= transfer;
        deficitShip.cbAfter += transfer;
        needed -= transfer;
      }
    }

    return sorted;
  }
}