import { type ReactElement } from 'react';
import type { ComparisonResponseDTO } from '../../../core/application/dto/ComparisonDTO';
import Badge from '../Shared/Badge';
import { formatNumber } from '../../../shared/utils/formatters';

interface ComparisonTableProps {
  data: ComparisonResponseDTO;
}

export default function ComparisonTable({ data }: ComparisonTableProps): ReactElement {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Route ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vessel Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              GHG Intensity
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              % Difference
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Compliant
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.comparisons.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                No routes to compare
              </td>
            </tr>
          ) : (
            data.comparisons.map((comparison, index) => (
              <tr key={index} className={comparison.compliant ? 'bg-green-50' : 'bg-red-50'}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {comparison.route.routeId}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {comparison.route.vesselType}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  {formatNumber(comparison.route.ghgIntensity)} gCO₂e/MJ
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={
                      comparison.percentDiff > 0
                        ? 'text-red-600 font-medium'
                        : 'text-green-600 font-medium'
                    }
                  >
                    {comparison.percentDiff > 0 ? '+' : ''}
                    {formatNumber(comparison.percentDiff)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <Badge variant={comparison.compliant ? 'success' : 'danger'}>
                    {comparison.compliant ? 'Compliant ✅' : 'Non-Compliant ❌'}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}