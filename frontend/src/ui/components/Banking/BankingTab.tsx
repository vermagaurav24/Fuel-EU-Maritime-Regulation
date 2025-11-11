import { useState, type ReactElement } from 'react';
import Card from '../Shared/Card';
import BankingForm from './BankingForm';
import BankingKPIs from './BankingKPIs';
import BankRecords from './BankRecords';

export default function BankingTab(): ReactElement {
  const [selectedShip, setSelectedShip] = useState<string>('SHIP001');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleOperationSuccess = (): void => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">💰</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Banking Operations</h2>
            <p className="text-gray-600 mt-1">
              FuelEU Maritime Article 20 - Bank positive compliance balance for future use
            </p>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <BankingKPIs
        shipId={selectedShip}
        year={selectedYear}
        refreshTrigger={refreshTrigger}
      />

      {/* Ship and Year Selection */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Ship & Year</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ship ID
            </label>
            <select
              value={selectedShip}
              onChange={(e) => setSelectedShip(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="SHIP001">SHIP001</option>
              <option value="SHIP002">SHIP002</option>
              <option value="SHIP003">SHIP003</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Banking Forms */}
      <BankingForm
        shipId={selectedShip}
        year={selectedYear}
        onSuccess={handleOperationSuccess}
      />

      {/* Bank Records */}
      <BankRecords
        shipId={selectedShip}
        year={selectedYear}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}