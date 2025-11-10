import { Request, Response } from 'express';
import { BankSurplus } from '../../../../core/use-cases/banking/BankSurplus';
import { ApplyBanked } from '../../../../core/use-cases/banking/ApplyBanked';
import { IBankingRepository } from '../../../../core/ports/outbound/IBankingRepository';
import { HttpStatus } from '../../../../config/constants';

/**
 * Banking Controller
 * Handles HTTP requests for banking operations
 */
export class BankingController {
  constructor(
    private readonly bankSurplus: BankSurplus,
    private readonly applyBanked: ApplyBanked,
    private readonly bankingRepository: IBankingRepository
  ) {}

  /**
   * GET /banking/records?shipId=xxx&year=2024
   * Get bank records for a ship
   */
  getRecords = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year } = req.query;

      if (!shipId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'shipId is required',
        });
        return;
      }

      let records;
      if (year) {
        records = await this.bankingRepository.findByShipAndYear(
          shipId as string,
          parseInt(year as string)
        );
      } else {
        records = await this.bankingRepository.findAvailableByShip(shipId as string);
      }

      const totalAvailable = await this.bankingRepository.getTotalAvailable(shipId as string);

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          records,
          totalAvailable,
        },
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * POST /banking/bank
   * Bank positive compliance balance
   * Body: { shipId, year, amount }
   */
  bank = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year || !amount) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'shipId, year, and amount are required',
        });
        return;
      }

      const result = await this.bankSurplus.execute({
        shipId,
        year: parseInt(year),
        amount: parseFloat(amount),
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Surplus banked successfully',
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * POST /banking/apply
   * Apply banked surplus to deficit
   * Body: { shipId, year, amount }
   */
  apply = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year || !amount) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'shipId, year, and amount are required',
        });
        return;
      }

      const result = await this.applyBanked.execute({
        shipId,
        year: parseInt(year),
        amount: parseFloat(amount),
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Banked surplus applied successfully',
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}