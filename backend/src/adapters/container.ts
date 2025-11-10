import { PrismaClient } from '@prisma/client';

// Repositories
import { RouteRepository } from './outbound/persistence/repositories/RouteRepository';
import { ComplianceRepository } from './outbound/persistence/repositories/ComplianceRepository';
import { BankingRepository } from './outbound/persistence/repositories/BankingRepository';
import { PoolingRepository } from './outbound/persistence/repositories/PoolingRepository';

// Use Cases
import { GetAllRoutes } from '../core/use-cases/routes/GetAllRoutes';
import { SetBaseline } from '../core/use-cases/routes/SetBaseline';
import { CompareRoutes } from '../core/use-cases/routes/CompareRoutes';
import { ComputeCB } from '../core/use-cases/compliance/ComputeCB';
import { GetAdjustedCB } from '../core/use-cases/compliance/GetAdjustedCB';
import { BankSurplus } from '../core/use-cases/banking/BankSurplus';
import { ApplyBanked } from '../core/use-cases/banking/ApplyBanked';
import { CreatePool } from '../core/use-cases/pooling/CreatePool';

// Controllers
import { RouteController } from './inbound/http/routes/RouteController';
import { ComplianceController } from './inbound/http/compliance/ComplianceController';
import { BankingController } from './inbound/http/banking/BankingController';
import { PoolingController } from './inbound/http/pooling/PoolingController';

/**
 * Dependency Injection Container
 * Wires up all dependencies following hexagonal architecture
 */
export class Container {
  // Infrastructure
  public readonly prisma: PrismaClient;

  // Repositories (Outbound Adapters)
  public readonly routeRepository: RouteRepository;
  public readonly complianceRepository: ComplianceRepository;
  public readonly bankingRepository: BankingRepository;
  public readonly poolingRepository: PoolingRepository;

  // Use Cases (Core Logic)
  public readonly getAllRoutes: GetAllRoutes;
  public readonly setBaseline: SetBaseline;
  public readonly compareRoutes: CompareRoutes;
  public readonly computeCB: ComputeCB;
  public readonly getAdjustedCB: GetAdjustedCB;
  public readonly bankSurplus: BankSurplus;
  public readonly applyBanked: ApplyBanked;
  public readonly createPool: CreatePool;

  // Controllers (Inbound Adapters)
  public readonly routeController: RouteController;
  public readonly complianceController: ComplianceController;
  public readonly bankingController: BankingController;
  public readonly poolingController: PoolingController;

  constructor() {
    // Initialize Prisma
    this.prisma = new PrismaClient();

    // Initialize Repositories
    this.routeRepository = new RouteRepository(this.prisma);
    this.complianceRepository = new ComplianceRepository(this.prisma);
    this.bankingRepository = new BankingRepository(this.prisma);
    this.poolingRepository = new PoolingRepository(this.prisma);

    // Initialize Use Cases
    this.getAllRoutes = new GetAllRoutes(this.routeRepository);
    this.setBaseline = new SetBaseline(this.routeRepository);
    this.compareRoutes = new CompareRoutes(this.routeRepository);
    
    this.computeCB = new ComputeCB(
      this.complianceRepository,
      this.routeRepository
    );
    
    this.getAdjustedCB = new GetAdjustedCB(
      this.complianceRepository,
      this.bankingRepository
    );
    
    this.bankSurplus = new BankSurplus(
      this.complianceRepository,
      this.bankingRepository
    );
    
    this.applyBanked = new ApplyBanked(
      this.complianceRepository,
      this.bankingRepository
    );
    
    this.createPool = new CreatePool(
      this.poolingRepository,
      this.complianceRepository
    );

    // Initialize Controllers
    this.routeController = new RouteController(
      this.getAllRoutes,
      this.setBaseline,
      this.compareRoutes
    );

    this.complianceController = new ComplianceController(
      this.computeCB,
      this.getAdjustedCB
    );

    this.bankingController = new BankingController(
      this.bankSurplus,
      this.applyBanked,
      this.bankingRepository
    );

    this.poolingController = new PoolingController(
      this.createPool,
      this.poolingRepository
    );
  }

  /**
   * Cleanup resources
   */
  async close(): Promise<void> {
    await this.prisma.$disconnect();
  }
}