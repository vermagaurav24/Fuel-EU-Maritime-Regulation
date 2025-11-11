import { type ReactElement } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import type { ComparisonResponseDTO } from '../../../core/application/dto/ComparisonDTO';

interface ComparisonChartProps {
  data: ComparisonResponseDTO;
}

interface ChartDataPoint {
  name: string;
  intensity: number;
  isBaseline: boolean;
  compliant: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
}

export default function ComparisonChart({ data }: ComparisonChartProps): ReactElement {
  const chartData: ChartDataPoint[] = [
    {
      name: data.baseline.routeId,
      intensity: data.baseline.ghgIntensity,
      isBaseline: true,
      compliant: data.baseline.ghgIntensity <= data.targetIntensity,
    },
    ...data.comparisons.map((comp) => ({
      name: comp.route.routeId,
      intensity: comp.route.ghgIntensity,
      isBaseline: false,
      compliant: comp.compliant,
    })),
  ];

  const CustomTooltip = ({ active, payload }: CustomTooltipProps): ReactElement | null => {
    if (active && payload && payload.length) {
      const chartEntry = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{chartEntry.name}</p>
          <p className="text-sm text-gray-600">
            Intensity: <span className="font-medium">{chartEntry.intensity.toFixed(2)} gCO₂e/MJ</span>
          </p>
          <p className="text-sm">
            Status:{' '}
            <span className={chartEntry.compliant ? 'text-green-600' : 'text-red-600'}>
              {chartEntry.compliant ? '✅ Compliant' : 'Non-Compliant'}
            </span>
          </p>
          {chartEntry.isBaseline && (
            <p className="text-xs text-blue-600 mt-1">Baseline Route</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <YAxis
          label={{
            value: 'GHG Intensity (gCO₂e/MJ)',
            angle: -90,
            position: 'insideLeft',
            style: { fontSize: 12, fill: '#6b7280' },
          }}
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 14 }}
        />
        <ReferenceLine
          y={data.targetIntensity}
          stroke="#ef4444"
          strokeDasharray="5 5"
          strokeWidth={2}
          label={{
            value: `Target: ${data.targetIntensity.toFixed(2)}`,
            position: 'right',
            fill: '#ef4444',
            fontSize: 12,
          }}
        />
        <Bar
          dataKey="intensity"
          name="GHG Intensity"
          radius={[8, 8, 0, 0]}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.isBaseline ? '#2563eb' : entry.compliant ? '#22c55e' : '#ef4444'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}