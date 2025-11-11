import { type ReactElement } from 'react';
import type { RouteDTO } from '../../../core/application/dto/RouteDTO';
import Button from '../Shared/Button';

interface RouteTableProps {
  routes: RouteDTO[];
  onSetBaseline: (routeId: string) => Promise<void>;
}

export default function RouteTable({ routes, onSetBaseline }: RouteTableProps): ReactElement {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-900">Route ID</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-900">Vessel Type</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-900">Fuel Type</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-900">Year</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-900">GHG Intensity</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-900">Distance</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-900">Action</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 text-gray-700">{route.routeId}</td>
              <td className="px-4 py-2 text-gray-700">{route.vesselType}</td>
              <td className="px-4 py-2 text-gray-700">{route.fuelType}</td>
              <td className="px-4 py-2 text-gray-700">{route.year}</td>
              <td className="px-4 py-2 text-gray-700">{route.ghgIntensity.toFixed(2)}</td>
              <td className="px-4 py-2 text-gray-700">{route.distance}</td>
              <td className="px-4 py-2">
                <Button
                  size="sm"
                  variant={route.isBaseline ? 'primary' : 'secondary'}
                  onClick={() => onSetBaseline(route.routeId)}
                >
                  {route.isBaseline ? 'Baseline' : 'Set'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}