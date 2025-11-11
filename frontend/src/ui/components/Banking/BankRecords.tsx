import { useState, useEffect, type ReactElement } from 'react';
import Card from '../Shared/Card';
import Badge from '../Shared/Badge';
import Loading from '../Shared/Loading';
import { BankingRepository } from '../../../infrastructure/api/repositories/BankingRepository';
import type { BankEntryDTO, BankRecordsResponseDTO } from '../../../core/application/dto/BankingDTO';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';

interface BankRecordsProps {
  shipId: string;
  year: number;
  refreshTrigger: number;
}

const bankingRepository = new BankingRepository();

export default function BankRecords({ shipId, year, refreshTrigger }: BankRecordsProps): ReactElement {
  const [records, setRecords] = useState<BankEntryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchRecords();
  }, [shipId, year, refreshTrigger]);

  const fetchRecords = async (): Promise<void> => {
    try {
      setLoading(true);
      const data: BankRecordsResponseDTO = await bankingRepository.getRecords(shipId, year);
      setRecords(data.records);
    } catch (error) {
      console.error('Error fetching bank records:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <Loading />
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Banking History</h3>
      {records.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No banking records found for this ship and year
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Year
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount (tCO₂)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatDate(record.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{record.year}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {formatCurrency(record.amountGco2eq)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {record.isApplied ? (
                      <Badge variant="info">Applied</Badge>
                    ) : (
                      <Badge variant="success">Available</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}