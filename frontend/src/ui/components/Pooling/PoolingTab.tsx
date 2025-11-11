import Card from '../Shared/Card';

export default function PoolingTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">🤝</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pooling Operations</h2>
            <p className="text-gray-600 mt-1">
              FuelEU Maritime Article 21 - Create pooling arrangements between multiple ships
            </p>
          </div>
        </div>
      </Card>

      {/* Info Card */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About Pooling</h3>
        <div className="space-y-3 text-gray-700">
          <p>
            Pooling allows multiple ships to combine their compliance balances to achieve collective compliance.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Pooling Rules:</h4>
            <ul className="space-y-1 text-sm text-blue-800 list-disc list-inside">
              <li>Total pool compliance balance must be non-negative (≥ 0)</li>
              <li>Deficit ships cannot exit worse than they entered</li>
              <li>Surplus ships cannot exit with negative balance</li>
              <li>Total balance is conserved (sum before = sum after)</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Coming Soon */}
      <Card className="text-center py-12">
        <div className="text-6xl mb-4">🚧</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Pooling Feature Coming Soon
        </h3>
        <p className="text-gray-600">
          Full pooling functionality will be available in the next release.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Connect backend API to enable pooling operations
        </p>
      </Card>
    </div>
  );
}