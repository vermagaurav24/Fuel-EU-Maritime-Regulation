import { type ReactElement } from 'react';
import type { RouteFilterDTO } from '../../../core/application/dto/RouteDTO';
import { VESSEL_TYPES, FUEL_TYPES, YEARS } from '../../../shared/constants';

interface RouteFiltersProps {
  filters: RouteFilterDTO;
  onFilterChange: (filters: RouteFilterDTO) => void;
}

export default function RouteFilters({ filters, onFilterChange }: RouteFiltersProps): ReactElement {
  const handleChange = (key: keyof RouteFilterDTO, value: string): void => {
    onFilterChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Vessel Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vessel Type
        </label>
        <select
          value={filters.vesselType || ''}
          onChange={(e) => handleChange('vesselType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Types</option>
          {VESSEL_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Fuel Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fuel Type
        </label>
        <select
          value={filters.fuelType || ''}
          onChange={(e) => handleChange('fuelType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Fuels</option>
          {FUEL_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Year Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Year
        </label>
        <select
          value={filters.year || ''}
          onChange={(e) => handleChange('year', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Years</option>
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}