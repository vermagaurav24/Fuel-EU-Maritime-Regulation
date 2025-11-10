import { PrismaClient } from '@prisma/client';
import { BankEntry } from '../../../../core/domain/entities/BankEntry';
import { IBankingRepository } from '../../../../core/ports/outbound/IBankingRepository';

/**
 * Banking Repository Implementation
 * Handles banked surplus persistence
 */
export class BankingRepository implements IBankingRepository {
  constructor(private readonly prisma: PrismaClient) {}


async getBankedCredits(vesselId: string) {
    const record = await this.prisma.banking.findUnique({
      where: { vesselId },
    });
    return record ? record.credits : 0;
  }

  async addToBank(vesselId: string, surplus: number) {
    const existing = await this.prisma.banking.findUnique({ where: { vesselId } });

    if (existing) {
      return this.prisma.banking.update({
        where: { vesselId },
        data: { credits: existing.credits + surplus },
      });
    } else {
      return this.prisma.banking.create({
        data: { vesselId, credits: surplus },
      });
    }
  }

  /**
   * Find bank entries by ship and year
   */
  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    const entries = await this.prisma.bankEntry.findMany({
      where: { shipId, year },
      orderBy: { createdAt: 'asc' }, // FIFO ordering
    });

    return entries.map(this.toDomain);
  }

  /**
   * Find all available (not applied) bank entries for a ship
   */
  async findAvailableByShip(shipId: string): Promise<BankEntry[]> {
    const entries = await this.prisma.bankEntry.findMany({
      where: {
        shipId,
        isApplied: false,
      },
      orderBy: { createdAt: 'asc' }, // FIFO - oldest first
    });

    return entries.map(this.toDomain);
  }

  /**
   * Save new bank entry
   */
  async save(entry: BankEntry): Promise<BankEntry> {
    const created = await this.prisma.bankEntry.create({
      data: {
        shipId: entry.shipId,
        year: entry.year,
        amountGco2eq: entry.amountGco2eq,
        isApplied: entry.isApplied,
      },
    });

    return this.toDomain(created);
  }

  /**
   * Update bank entry
   */
  async update(entry: BankEntry): Promise<BankEntry> {
    const updated = await this.prisma.bankEntry.update({
      where: { id: entry.id },
      data: {
        amountGco2eq: entry.amountGco2eq,
        isApplied: entry.isApplied,
      },
    });

    return this.toDomain(updated);
  }

  /**
   * Get total available banked amount for a ship
   */
  async getTotalAvailable(shipId: string): Promise<number> {
    const result = await this.prisma.bankEntry.aggregate({
      where: {
        shipId,
        isApplied: false,
      },
      _sum: {
        amountGco2eq: true,
      },
    });

    return result._sum.amountGco2eq || 0;
  }

  /**
   * Convert Prisma model to Domain entity
   */
  private toDomain(prismaEntry: any): BankEntry {
    return new BankEntry(
      prismaEntry.id,
      prismaEntry.shipId,
      prismaEntry.year,
      prismaEntry.amountGco2eq,
      prismaEntry.isApplied
    );
  }
}