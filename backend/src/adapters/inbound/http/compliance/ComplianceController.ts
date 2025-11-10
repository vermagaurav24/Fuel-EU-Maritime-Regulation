import { Request, Response } from 'express';
import { ComputeCB } from '../../../../core/use-cases/compliance/ComputeCB';
import { GetAdjustedCB } from '../../../../core/use-cases/compliance/GetAdjustedCB';
import { HttpStatus } from '../../../../config/constants';

/**
 * Compliance Controller
 * Handles HTTP requests for compliance balance operations
 */
export class ComplianceController {
  constructor(
    private readonly computeCB: ComputeCB,
    private readonly getAdjustedCB: GetAdjustedCB
  ) {}

  /**
   * GET /compliance/cb?shipId=xxx&year=2024
   * Get or compute compliance balance
   */
  getComplianceBalance = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year, routeId } = req.query;

      if (!shipId || !year || !routeId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'shipId, year, and routeId are required',
        });
        return;
      }

      const result = await this.computeCB.execute({
        shipId: shipId as string,
        year: parseInt(year as string),
        routeId: routeId as string,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * GET /compliance/adjusted-cb?shipId=xxx&year=2024
   * Get adjusted compliance balance (after banking)
   */
  getAdjustedBalance = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'shipId and year are required',
        });
        return;
      }

      const result = await this.getAdjustedCB.execute(
        shipId as string,
        parseInt(year as string)
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}