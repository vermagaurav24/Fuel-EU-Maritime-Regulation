import { Request, Response } from 'express';
import { GetAllRoutes } from '../../../../core/use-cases/routes/GetAllRoutes';
import { SetBaseline } from '../../../../core/use-cases/routes/SetBaseline';
import { CompareRoutes } from '../../../../core/use-cases/routes/CompareRoutes';
import { HttpStatus } from '../../../../config/constants';

/**
 * Route Controller
 * Handles HTTP requests for route operations
 */
export class RouteController {
  constructor(
    private readonly getAllRoutes: GetAllRoutes,
    private readonly setBaseline: SetBaseline,
    private readonly compareRoutes: CompareRoutes
  ) {}

  /**
   * GET /routes
   * Get all routes with optional filters
   */
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { vesselType, fuelType, year } = req.query;

      const filter = {
        vesselType: vesselType as string | undefined,
        fuelType: fuelType as string | undefined,
        year: year ? parseInt(year as string) : undefined,
      };

      const routes = await this.getAllRoutes.execute(filter);

      res.status(HttpStatus.OK).json({
        success: true,
        data: routes,
        count: routes.length,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * POST /routes/:routeId/baseline
   * Set a route as baseline
   */
  setBaselineRoute = async (req: Request, res: Response): Promise<void> => {
    try {
      const { routeId } = req.params;

      const route = await this.setBaseline.execute(routeId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: `Route ${routeId} set as baseline`,
        data: route,
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found')
        ? HttpStatus.NOT_FOUND
        : HttpStatus.INTERNAL_SERVER_ERROR;

      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * GET /routes/comparison
   * Compare all routes against baseline
   */
  getComparison = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.compareRoutes.execute();

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('No baseline')
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.INTERNAL_SERVER_ERROR;

      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}