import { Request, Response } from 'express';
import { CreatePool } from '../../../../core/use-cases/pooling/CreatePool';
import { IPoolingRepository } from '../../../../core/ports/outbound/IPoolingRepository';
import { HttpStatus } from '../../../../config/constants';

/**
 * Pooling Controller
 * Handles HTTP requests for pooling operations
 */
export class PoolingController {
  constructor(
    private readonly createPool: CreatePool,
    private readonly poolingRepository: IPoolingRepository
  ) {}

  /**
   * POST /pools
   * Create a new pool
   * Body: { year, memberShipIds: [] }
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { year, memberShipIds } = req.body;

      if (!year || !memberShipIds || !Array.isArray(memberShipIds)) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'year and memberShipIds (array) are required',
        });
        return;
      }

      const pool = await this.createPool.execute({
        year: parseInt(year),
        memberShipIds,
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Pool created successfully',
        data: pool,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * GET /pools?year=2024
   * Get pools for a specific year
   */
  getByYear = async (req: Request, res: Response): Promise<void> => {
    try {
      const { year } = req.query;

      if (!year) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'year is required',
        });
        return;
      }

      const pools = await this.poolingRepository.findByYear(parseInt(year as string));

      res.status(HttpStatus.OK).json({
        success: true,
        data: pools,
        count: pools.length,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}