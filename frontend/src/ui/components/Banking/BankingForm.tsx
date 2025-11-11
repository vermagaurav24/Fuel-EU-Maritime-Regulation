import { useState } from 'react';
import Card from '../Shared/Card';
import Button from '../Shared/Button';
import { BankingRepository } from '../../../infrastructure/api/repositories/BankingRepository';

interface BankingFormProps {
  shipId: string;
  year: number;
  onSuccess: () => void;
}

const bankingRepository = new BankingRepository();

export default function BankingForm({ shipId, year, onSuccess }: BankingFormProps) {
  const [bankAmount, setBankAmount] = useState('');
  const [applyAmount, setApplyAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const handleBankSurplus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage(null);
      await bankingRepository.bankSurplus({
        shipId,
        year,
        amount: parseFloat(bankAmount),
      });
      setMessage({ type: 'success', text: 'Surplus banked successfully!' });
      setBankAmount('');
      onSuccess();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to bank surplus',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyBanked = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage(null);
      await bankingRepository.applyBanked({
        shipId,
        year,
        amount: parseFloat(applyAmount),
      });
      setMessage({ type: 'success', text: 'Banked surplus applied successfully!' });
      setApplyAmount('');
      onSuccess();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to apply banked surplus',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Bank Surplus Form */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">💾</span>
          Bank Surplus
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Save positive compliance balance for future use
        </p>
        <form onSubmit={handleBankSurplus} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (tCO₂)
            </label>
            <input
              type="number"
              value={bankAmount}
              onChange={(e) => setBankAmount(e.target.value)}
              placeholder="Enter amount to bank"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>
          <Button type="submit" disabled={loading || !bankAmount} className="w-full">
            {loading ? 'Banking...' : 'Bank Surplus'}
          </Button>
        </form>
      </Card>

      {/* Apply Banked Form */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📥</span>
          Apply Banked Surplus
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Use previously banked surplus to cover deficit
        </p>
        <form onSubmit={handleApplyBanked} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (tCO₂)
            </label>
            <input
              type="number"
              value={applyAmount}
              onChange={(e) => setApplyAmount(e.target.value)}
              placeholder="Enter amount to apply"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>
          <Button type="submit" disabled={loading || !applyAmount} className="w-full">
            {loading ? 'Applying...' : 'Apply Banked'}
          </Button>
        </form>
      </Card>

      {/* Message Display */}
      {message && (
        <div className="md:col-span-2">
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        </div>
      )}
    </div>
  );
}