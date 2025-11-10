import { PrismaClient, Prisma } from '@prisma/client';
import { Route } from '../../../../core/domain/entities/Route';
import { IRouteRepository, RouteFilter } from '../../../../core/ports/outbound/IRouteRepository';

/**
 * Route Repository Implementation
 * Handles all database operations for routes using Prisma
 */
export class RouteRepository implements IRouteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Find all routes with optional filtering
   */
  async findAll(filter?: RouteFilter): Promise<Route[]> {
    const where: any = {};

    if (filter?.vesselType) {
      where.vesselType = filter.vesselType;
    }
    if (filter?.fuelType) {
      where.fuelType = filter.fuelType;
    }
    if (filter?.year) {
      where.year = filter.year;
    }

    const routes = await this.prisma.route.findMany({
      where,
      orderBy: { year: 'asc' },
    });

    return routes.map(this.toDomain);
  }

  /**
   * Find route by database ID
   */
  async findById(id: number): Promise<Route | null> {
    const route = await this.prisma.route.findUnique({
      where: { id },
    });

    return route ? this.toDomain(route) : null;
  }

  /**
   * Find route by route ID (business identifier)
   */
  async findByRouteId(routeId: string): Promise<Route | null> {
    const route = await this.prisma.route.findUnique({
      where: { routeId },
    });

    return route ? this.toDomain(route) : null;
  }

  /**
   * Find the current baseline route
   */
  async findBaseline(): Promise<Route | null> {
    const route = await this.prisma.route.findFirst({
      where: { isBaseline: true },
    });

    return route ? this.toDomain(route) : null;
  }

  /**
   * Save a new route
   */
  async save(route: Route): Promise<Route> {
    const created = await this.prisma.route.create({
      data: {
        routeId: route.routeId,
        vesselType: route.vesselType,
        fuelType: route.fuelType,
        year: route.year,
        ghgIntensity: route.ghgIntensity,
        fuelConsumption: route.fuelConsumption,
        distance: route.distance,
        totalEmissions: route.totalEmissions,
        isBaseline: route.isBaseline,
      },
    });

    return this.toDomain(created);
  }

  /**
   * Update existing route
   */
  async update(route: Route): Promise<Route> {
    const updated = await this.prisma.route.update({
      where: { id: route.id },
      data: {
        vesselType: route.vesselType,
        fuelType: route.fuelType,
        year: route.year,
        ghgIntensity: route.ghgIntensity,
        fuelConsumption: route.fuelConsumption,
        distance: route.distance,
        totalEmissions: route.totalEmissions,
        isBaseline: route.isBaseline,
      },
    });

    return this.toDomain(updated);
  }

  /**
   * Set a route as baseline (and remove baseline from others)
   */
  async setBaseline(routeId: string): Promise<Route> {
    // Use transaction to ensure consistency
    const result = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Remove baseline from all routes
      await tx.route.updateMany({
        where: { isBaseline: true },
        data: { isBaseline: false },
      });

      // Set new baseline
      return await tx.route.update({
        where: { routeId },
        data: { isBaseline: true },
      });
    });

    return this.toDomain(result);
  }

  async updateBaseline(routeId: string, baselineData: any) {
    return this.prisma.route.update({
      where: { routeId },
      data: { isBaseline: baselineData },
    });
  }

  /**
   * Convert Prisma model to Domain entity
   */
  private toDomain(prismaRoute: any): Route {
    return new Route(
      prismaRoute.id,
      prismaRoute.routeId,
      prismaRoute.vesselType,
      prismaRoute.fuelType,
      prismaRoute.year,
      prismaRoute.ghgIntensity,
      prismaRoute.fuelConsumption,
      prismaRoute.distance,
      prismaRoute.totalEmissions,
      prismaRoute.isBaseline
    );
  }
}