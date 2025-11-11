import { useState, useEffect } from 'react';
import Card from '../Shared/Card';
import { BankingRepository } from '../../../infrastructure/api/repositories/BankingRepository';
import { formatCurrency } from '../../../shared/utils/formatters';

interface BankingKPIsProps {
  shipId: string;
  year: number;
  refreshTrigger: number;
}

const bankingRepository = new BankingRepository();

export default function BankingKPIs({ shipId, year, refreshTrigger }: BankingKPIsProps) {
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [shipId, year, refreshTrigger]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await bankingRepository.getRecords(shipId, year);
      setTotalAvailable(data.totalAvailable);
    } catch (error) {
      console.error('Error fetching banking KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Current Ship</p>
            <p className="text-2xl font-bold text-gray-900">{shipId}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🚢</span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Selected Year</p>
            <p className="text-2xl font-bold text-gray-900">{year}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📅</span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Banked Available</p>
            <p className="text-2xl font-bold text-green-600">
              {loading ? '...' : formatCurrency(totalAvailable)}{' '}
              <span className="text-sm text-gray-500">tCO₂</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">💵</span>
          </div>
        </div>
      </Card>
    </div>
  );
}