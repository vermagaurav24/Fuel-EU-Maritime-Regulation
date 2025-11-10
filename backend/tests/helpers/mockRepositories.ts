import { Route } from '../../src/core/domain/entities/Route';
import { ShipCompliance } from '../../src/core/domain/entities/ShipCompliance';
import { BankEntry } from '../../src/core/domain/entities/BankEntry';
import { Pool } from '../../src/core/domain/entities/Pool';
import { IRouteRepository, RouteFilter } from '../../src/core/ports/outbound/IRouteRepository';
import { IComplianceRepository } from '../../src/core/ports/outbound/IComplianceRepository';
import { IBankingRepository } from '../../src/core/ports/outbound/IBankingRepository';
import { IPoolingRepository } from '../../src/core/ports/outbound/IPoolingRepository';

/**
 * Mock Route Repository
 */
export class MockRouteRepository implements IRouteRepository {
  private routes: Route[] = [];
  prisma: any; // Mock placeholder

  constructor(initialRoutes: Route[] = []) {
    this.routes = initialRoutes;
  }

  async findAll(filter?: RouteFilter): Promise<Route[]> {
    let result = [...this.routes];
    if (filter?.vesselType) result = result.filter(r => r.vesselType === filter.vesselType);
    if (filter?.fuelType) result = result.filter(r => r.fuelType === filter.fuelType);
    if (filter?.year) result = result.filter(r => r.year === filter.year);
    return result;
  }

  async findById(id: number): Promise<Route | null> {
    return this.routes.find(r => r.id === id) || null;
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    return this.routes.find(r => r.routeId === routeId) || null;
  }

  async findBaseline(): Promise<Route | null> {
    return this.routes.find(r => r.isBaseline) || null;
  }

  async save(route: Route): Promise<Route> {
    this.routes.push(route);
    return route;
  }

  async update(route: Route): Promise<Route> {
    const index = this.routes.findIndex(r => r.id === route.id);
    if (index !== -1) {
      this.routes[index] = route;
    }
    return route;
  }

  async setBaseline(routeId: string): Promise<Route> {
    this.routes.forEach(r => (r.isBaseline = false));

    const route = await this.findByRouteId(routeId);
    if (!route) throw new Error(`Route ${routeId} not found`);
    route.isBaseline = true;
    return route;
  }

  // 🔹 Add these 2 mock methods to match real repository
  async updateBaseline(routeId: string): Promise<Route> {
    return this.setBaseline(routeId);
  }

  toDomain(data: any): Route {
    return data as Route;
  }
}

/**
 * Mock Compliance Repository
 */
export class MockComplianceRepository implements IComplianceRepository {
  private compliances: ShipCompliance[] = [];

  constructor(initialCompliances: ShipCompliance[] = []) {
    this.compliances = initialCompliances;
  }

  async findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null> {
    return (
      this.compliances.find((c) => c.shipId === shipId && c.year === year) || null
    );
  }

  async save(compliance: ShipCompliance): Promise<ShipCompliance> {
    this.compliances.push(compliance);
    return compliance;
  }

  async update(compliance: ShipCompliance): Promise<ShipCompliance> {
    const index = this.compliances.findIndex((c) => c.id === compliance.id);
    if (index !== -1) {
      this.compliances[index] = compliance;
    }
    return compliance;
  }

  async findAll(): Promise<ShipCompliance[]> {
    return [...this.compliances];
  }
}

/**
 * Mock Banking Repository
 */
export class MockBankingRepository implements IBankingRepository {
  private entries: BankEntry[] = [];

  constructor(initialEntries: BankEntry[] = []) {
    this.entries = initialEntries;
  }

  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    return this.entries.filter((e) => e.shipId === shipId && e.year === year);
  }

  async findAvailableByShip(shipId: string): Promise<BankEntry[]> {
    return this.entries
      .filter((e) => e.shipId === shipId && !e.isApplied)
      .sort((a, b) => a.id - b.id); 
  }

  async save(entry: BankEntry): Promise<BankEntry> {
    this.entries.push(entry);
    return entry;
  }

  async update(entry: BankEntry): Promise<BankEntry> {
    const index = this.entries.findIndex((e) => e.id === entry.id);
    if (index !== -1) {
      this.entries[index] = entry;
    }
    return entry;
  }

  async getTotalAvailable(shipId: string): Promise<number> {
    return this.entries
      .filter((e) => e.shipId === shipId && !e.isApplied)
      .reduce((sum, e) => sum + e.amountGco2eq, 0);
  }
}

/**
 * Mock Pooling Repository
 */
export class MockPoolingRepository implements IPoolingRepository {
  private pools: Pool[] = [];

  async save(pool: Pool): Promise<Pool> {
    this.pools.push(pool);
    return pool;
  }

  async findById(id: number): Promise<Pool | null> {
    return this.pools.find((p) => p.id === id) || null;
  }

  async findByYear(year: number): Promise<Pool[]> {
    return this.pools.filter((p) => p.year === year);
  }
}