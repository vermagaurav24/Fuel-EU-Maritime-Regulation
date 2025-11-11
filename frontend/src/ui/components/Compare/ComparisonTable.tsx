import { type ReactElement } from 'react';
import type { ComparisonResponseDTO } from '../../../core/application/dto/ComparisonDTO';
import Badge from '../Shared/Badge';
import { formatNumber, formatPercentage } from '../../../shared/utils/formatters';

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
              % Difference from Baseline
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              vs Target ({formatNumber(data.targetIntensity)})
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Compliance Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.comparisons.map((comp) => {
            const vsTarget = comp.route.ghgIntensity - data.targetIntensity;
            return (
              <tr key={comp.route.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {comp.route.routeId}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {comp.route.vesselType}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  {formatNumber(comp.route.ghgIntensity)}{' '}
                  <span className="text-xs text-gray-500">gCO₂e/MJ</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={
                      comp.percentDiff < 0
                        ? 'text-green-600 font-medium'
                        : 'text-red-600 font-medium'
                    }
                  >
                    {formatPercentage(comp.percentDiff)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={
                      vsTarget <= 0
                        ? 'text-green-600 font-medium'
                        : 'text-red-600 font-medium'
                    }
                  >
                    {vsTarget > 0 ? '+' : ''}
                    {formatNumber(vsTarget)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {comp.compliant ? (
                    <Badge variant="success">Compliant</Badge>
                  ) : (
                    <Badge variant="danger">Non-Compliant</Badge>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}