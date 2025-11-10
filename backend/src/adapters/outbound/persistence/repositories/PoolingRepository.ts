import { PrismaClient } from '@prisma/client';
import { Pool, PoolMember } from '../../../../core/domain/entities/Pool';
import { IPoolingRepository } from '../../../../core/ports/outbound/IPoolingRepository';

/**
 * Pooling Repository Implementation
 * Handles pool and pool member persistence
 */
export class PoolingRepository implements IPoolingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Save a new pool with members
   */
  async save(pool: Pool): Promise<Pool> {
    const created = await this.prisma.pool.create({
      data: {
        year: pool.year,
        members: {
          create: pool.members.map((member) => ({
            shipId: member.shipId,
            cbBefore: member.cbBefore,
            cbAfter: member.cbAfter,
          })),
        },
      },
      include: {
        members: true,
      },
    });

    return this.toDomain(created);
  }

  /**
   * Find pool by ID
   */
  async findById(id: number): Promise<Pool | null> {
    const pool = await this.prisma.pool.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });

    return pool ? this.toDomain(pool) : null;
  }

  /**
   * Find all pools for a specific year
   */
  async findByYear(year: number): Promise<Pool[]> {
    const pools = await this.prisma.pool.findMany({
      where: { year },
      include: {
        members: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return pools.map(this.toDomain);
  }

  /**
   * Convert Prisma model to Domain entity
   */
  private toDomain(prismaPool: any): Pool {
    const members: PoolMember[] = prismaPool.members.map((m: any) => ({
      shipId: m.shipId,
      cbBefore: m.cbBefore,
      cbAfter: m.cbAfter,
    }));

    return new Pool(prismaPool.id, prismaPool.year, members);
  }
}