// src/components/Compare.tsx
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface RouteComparison {
  routeId: string;
  ghgIntensity: number;
  percentDiff: number;
  compliant: boolean;
}

interface ComparisonData {
  baseline: { routeId: string; ghgIntensity: number };
  comparison: RouteComparison[];
}

const dummyData: ComparisonData = {
  baseline: { routeId: "R001", ghgIntensity: 91 },
  comparison: [
    { routeId: "R002", ghgIntensity: 88, percentDiff: -3.3, compliant: true },
    { routeId: "R003", ghgIntensity: 93.5, percentDiff: 2.7, compliant: false },
    { routeId: "R004", ghgIntensity: 89.2, percentDiff: -2, compliant: false },
    { routeId: "R005", ghgIntensity: 90.5, percentDiff: -0.5, compliant: true },
  ],
};

export default function Compare() {
  const [data, setData] = useState<ComparisonData | null>(null);

  useEffect(() => {
    // Replace with axios call if backend exists
    setData(dummyData);
  }, []);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  const { baseline, comparison = [] } = data;
  const target = 89.3368;

  const chartData = [
    { routeId: baseline.routeId, ghgIntensity: baseline.ghgIntensity },
    ...comparison.map((r) => ({ routeId: r.routeId, ghgIntensity: r.ghgIntensity })),
  ];

  const nonCompliant = comparison.filter((r) => !r.compliant);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">GHG Intensity Comparison</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Chart */}
        <div className="flex-1 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="routeId" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ghgIntensity" name="GHG Intensity (gCO₂e/MJ)" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Non-compliant table */}
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Non-Compliant Routes</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Route ID</th>
                <th className="border px-2 py-1">GHG Intensity</th>
                <th className="border px-2 py-1">% Diff</th>
              </tr>
            </thead>
            <tbody>
              {nonCompliant.map((r) => (
                <tr key={r.routeId}>
                  <td className="border px-2 py-1">{r.routeId}</td>
                  <td className="border px-2 py-1">{r.ghgIntensity.toFixed(2)}</td>
                  <td className="border px-2 py-1">{r.percentDiff.toFixed(2)}</td>
                </tr>
              ))}
              {nonCompliant.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-2">All routes compliant ✅</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
