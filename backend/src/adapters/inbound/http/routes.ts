import { Router } from 'express';
import { RouteController } from './routes/RouteController';
import { ComplianceController } from './compliance/ComplianceController';
import { BankingController } from './banking/BankingController';
import { PoolingController } from './pooling/PoolingController';

/**
 * Setup all application routes
 */
export function setupRoutes(
  routeController: RouteController,
  complianceController: ComplianceController,
  bankingController: BankingController,
  poolingController: PoolingController
): Router {
  const router = Router();

  // Health check
  router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Route endpoints
  router.get('/routes', routeController.getAll);
  router.post('/routes/:routeId/baseline', routeController.setBaselineRoute);
  router.get('/routes/comparison', routeController.getComparison);

  // Compliance endpoints
  router.get('/compliance/cb', complianceController.getComplianceBalance);
  router.get('/compliance/adjusted-cb', complianceController.getAdjustedBalance);

  // Banking endpoints
  router.get('/banking/records', bankingController.getRecords);
  router.post('/banking/bank', bankingController.bank);
  router.post('/banking/apply', bankingController.apply);

  // Pooling endpoints
  router.post('/pools', poolingController.create);
  router.get('/pools', poolingController.getByYear);

  return router;
}