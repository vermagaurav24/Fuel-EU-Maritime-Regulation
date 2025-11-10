import { PrismaClient, ShipCompliance as PrismaShipCompliance } from '@prisma/client';
import { ShipCompliance } from '../../../../core/domain/entities/ShipCompliance';
import { IComplianceRepository } from '../../../../core/ports/outbound/IComplianceRepository';

/**
 * Compliance Repository Implementation
 * Handles compliance balance data persistence
 */
export class ComplianceRepository implements IComplianceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Get compliance record by shipId (if exists)
   */
  async getCompliance(shipId: string): Promise<ShipCompliance | null> {
    const compliance = await this.prisma.shipCompliance.findFirst({
      where: { shipId }, // ✅ changed from vesselId → shipId
    });

    return compliance ? this.toDomain(compliance) : null;
  }

  /**
   * Find compliance record by ship and year
   */
  async findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null> {
    const compliance = await this.prisma.shipCompliance.findUnique({
      where: {
        shipId_year: { shipId, year }, // ✅ composite unique key
      },
    });

    return compliance ? this.toDomain(compliance) : null;
  }

  /**
   * Save new compliance record
   */
  async save(compliance: ShipCompliance): Promise<ShipCompliance> {
    const created = await this.prisma.shipCompliance.create({
      data: {
        shipId: compliance.shipId, // ✅ correct field name
        year: compliance.year,
        cbGco2eq: compliance.cbGco2eq,
      },
    });

    return this.toDomain(created);
  }

  /**
   * Update existing compliance record
   */
  async update(compliance: ShipCompliance): Promise<ShipCompliance> {
    const updated = await this.prisma.shipCompliance.update({
      where: { id: compliance.id },
      data: {
        cbGco2eq: compliance.cbGco2eq,
      },
    });

    return this.toDomain(updated);
  }

  /**
   * Get all compliance records
   */
  async findAll(): Promise<ShipCompliance[]> {
    const records = await this.prisma.shipCompliance.findMany({
      orderBy: [{ year: 'desc' }, { shipId: 'asc' }],
    });

    // ✅ Use arrow fn to preserve context
    return records.map((r) => this.toDomain(r));
  }

  /**
   * Convert Prisma model to Domain entity
   */
  private toDomain(prismaCompliance: PrismaShipCompliance): ShipCompliance {
    return new ShipCompliance(
      prismaCompliance.id,
      prismaCompliance.shipId,
      prismaCompliance.year,
      prismaCompliance.cbGco2eq
    );
  }
}
