import { useEffect, useState } from "react";
import axios from "axios";

interface Route {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

const RoutesTab = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filters, setFilters] = useState({
    vesselType: "",
    fuelType: "",
    year: "",
  });

  

  const fetchRoutes = async () => {
    const res = await axios.get("http://localhost:5000/routes");
    setRoutes(res.data);
  };

  const handleSetBaseline = async (routeId: string) => {
    await axios.post(`http://localhost:5000/routes/${routeId}/baseline`);
    fetchRoutes();
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // Filtered routes based on selected filters
  const filteredRoutes = routes.filter((r) => {
    return (
      (filters.vesselType === "" || r.vesselType === filters.vesselType) &&
      (filters.fuelType === "" || r.fuelType === filters.fuelType) &&
      (filters.year === "" || r.year === parseInt(filters.year))
    );
  });

  // Get unique options for dropdowns
  const vesselTypes = Array.from(new Set(routes.map((r) => r.vesselType)));
  const fuelTypes = Array.from(new Set(routes.map((r) => r.fuelType)));
  const years = Array.from(new Set(routes.map((r) => r.year)));

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Routes Overview</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <select
          className="border px-3 py-2 rounded"
          value={filters.vesselType}
          onChange={(e) =>
            setFilters({ ...filters, vesselType: e.target.value })
          }
        >
          <option value="">All Vessel Types</option>
          {vesselTypes.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded"
          value={filters.fuelType}
          onChange={(e) =>
            setFilters({ ...filters, fuelType: e.target.value })
          }
        >
          <option value="">All Fuel Types</option>
          {fuelTypes.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Routes Table */}
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border px-3 py-2">Route ID</th>
            <th className="border px-3 py-2">Vessel Type</th>
            <th className="border px-3 py-2">Fuel Type</th>
            <th className="border px-3 py-2">Year</th>
            <th className="border px-3 py-2">GHG Intensity</th>
            <th className="border px-3 py-2">Fuel Consumption</th>
            <th className="border px-3 py-2">Distance (km)</th>
            <th className="border px-3 py-2">Total Emissions</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoutes.map((r) => (
            <tr
              key={r.routeId}
              className={`${
                r.isBaseline ? "bg-green-100 font-medium" : ""
              } hover:bg-gray-50`}
            >
              <td className="border px-3 py-2">{r.routeId}</td>
              <td className="border px-3 py-2">{r.vesselType}</td>
              <td className="border px-3 py-2">{r.fuelType}</td>
              <td className="border px-3 py-2">{r.year}</td>
              <td className="border px-3 py-2">{r.ghgIntensity}</td>
              <td className="border px-3 py-2">{r.fuelConsumption}</td>
              <td className="border px-3 py-2">{r.distance}</td>
              <td className="border px-3 py-2">{r.totalEmissions}</td>
              <td className="border px-3 py-2 text-center">
                <button
                  onClick={() => handleSetBaseline(r.routeId)}
                  className={`px-4 py-1 rounded ${
                    r.isBaseline
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {r.isBaseline ? "Baseline" : "Set Baseline"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoutesTab;
