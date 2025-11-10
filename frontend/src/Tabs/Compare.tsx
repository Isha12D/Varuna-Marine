import { useEffect, useState } from "react";
import axios from "axios";
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
  baseline: {
    routeId: string;
    ghgIntensity: number;
  };
  comparison: RouteComparison[];
}

export default function Compare() {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<ComparisonData>("http://localhost:5000/routes/comparison")
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Error fetching comparison:", err);
        setError("Failed to fetch comparison data.");
      });
  }, []);

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  if (!data)
    return <p className="text-center mt-10 text-gray-500">Loading comparison...</p>;

  const { baseline, comparison = [] } = data;
  const target = 89.3368; // 2% below 91.16

  // Prepare chart data
  const chartData = [
    { routeId: baseline.routeId, ghgIntensity: baseline.ghgIntensity, label: "Baseline" },
    ...comparison.map((route) => ({
      routeId: route.routeId,
      ghgIntensity: route.ghgIntensity,
      label: route.compliant ? "Compliant ✅" : "Non-Compliant ❌",
    })),
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        GHG Intensity Comparison
      </h2>

      {/* ✅ Bar Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <XAxis dataKey="routeId" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="ghgIntensity" name="GHG Intensity (gCO₂e/MJ)" />
        </BarChart>
      </ResponsiveContainer>

      {/* ✅ Summary */}
      <div className="mt-6 text-center">
        <p className="text-gray-700">
          Baseline Route: <span className="font-semibold">{baseline.routeId}</span> —{" "}
          <span className="text-blue-600 font-medium">
            {baseline.ghgIntensity.toFixed(2)} gCO₂e/MJ
          </span>
        </p>

        <p className="text-gray-700 mt-2">
          Target: <span className="font-semibold">{target}</span> gCO₂e/MJ
        </p>

        {comparison.length > 0 && (
          <div className="mt-4">
            {comparison.map((route) => (
              <p key={route.routeId} className="text-sm">
                Route <span className="font-medium">{route.routeId}</span> —{" "}
                {route.percentDiff >= 0 ? "+" : ""}
                {Number(route.percentDiff ?? 0).toFixed(2)}% compared to baseline —{" "}
                {route.compliant ? (
                  <span className="text-green-600 font-semibold">Compliant ✅</span>
                ) : (
                  <span className="text-red-600 font-semibold">Non-Compliant ❌</span>
                )}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
