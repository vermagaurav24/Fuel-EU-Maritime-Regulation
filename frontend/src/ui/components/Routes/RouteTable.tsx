import { type ReactElement } from 'react';
import type { RouteDTO } from '../../../core/application/dto/RouteDTO';
import Button from '../Shared/Button';
import Badge from '../Shared/Badge';
import { formatNumber, formatCurrency } from '../../../shared/utils/formatters';

interface RouteTableProps {
  routes: RouteDTO[];
  onSetBaseline: (routeId: string) => void;
}

export default function RouteTable({ routes, onSetBaseline }: RouteTableProps): ReactElement {
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
              Fuel Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              GHG Intensity
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fuel (t)
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Distance (km)
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Emissions (t)
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {routes.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                No routes found
              </td>
            </tr>
          ) : (
            routes.map((route) => (
              <tr
                key={route.id}
                className={route.isBaseline ? 'bg-green-50' : 'hover:bg-gray-50'}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  <div className="flex items-center space-x-2">
                    <span>{route.routeId}</span>
                    {route.isBaseline && <Badge variant="success">Baseline</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{route.vesselType}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {route.fuelType}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{route.year}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  {formatNumber(route.ghgIntensity)} <span className="text-gray-500 text-xs">gCO₂e/MJ</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {formatCurrency(route.fuelConsumption)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {formatCurrency(route.distance)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {formatCurrency(route.totalEmissions)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <Button
                    onClick={() => onSetBaseline(route.routeId)}
                    disabled={route.isBaseline}
                    size="sm"
                    variant={route.isBaseline ? 'secondary' : 'primary'}
                  >
                    {route.isBaseline ? 'Baseline' : 'Set Baseline'}
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}