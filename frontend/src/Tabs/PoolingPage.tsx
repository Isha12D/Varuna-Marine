// src/components/Pooling.tsx
import { useState } from "react";

type Ship = { id: string; name: string; cb: number; bankedCB: number };

export default function Pooling() {
  const dummyShips: Ship[] = [
    { id: "S001", name: "Ship A", cb: 50, bankedCB: 10 },
    { id: "S002", name: "Ship B", cb: -20, bankedCB: 5 },
    { id: "S003", name: "Ship C", cb: 30, bankedCB: 15 },
    { id: "S004", name: "Ship D", cb: -10, bankedCB: 0 },
  ];

  const [ships] = useState<Ship[]>(dummyShips);
  const [year, setYear] = useState<number>(2025);
  const [selectedShips, setSelectedShips] = useState<{ shipId: string; cb: number }[]>([]);
  const [poolResult, setPoolResult] = useState<any>(null);

  const toggleShip = (ship: Ship) => {
    const exists = selectedShips.find((s) => s.shipId === ship.id);
    if (exists) {
      setSelectedShips(selectedShips.filter((s) => s.shipId !== ship.id));
    } else {
      setSelectedShips([...selectedShips, { shipId: ship.id, cb: ship.cb }]);
    }
  };

  const createPool = () => {
    const totalCB = selectedShips.reduce((sum, s) => sum + s.cb, 0);
    const result = selectedShips.map((s) => ({
      shipId: s.shipId,
      cb_before: s.cb,
      cb_after: s.cb + (totalCB >= 0 ? 0 : totalCB / selectedShips.length),
    }));

    setPoolResult({
      year,
      totalCB,
      members: result,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Pooling</h2>

      <div className="mb-4 flex gap-2 items-center">
        <label className="font-medium">Year:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="border px-2 py-1 rounded w-24"
        />
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Select Ships:</h3>
        <div className="grid grid-cols-2 gap-2">
          {ships.map((ship) => (
            <label
              key={ship.id}
              className="flex items-center gap-2 border px-2 py-1 rounded cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={!!selectedShips.find((s) => s.shipId === ship.id)}
                onChange={() => toggleShip(ship)}
              />
              {ship.name} (CB: {ship.cb}, Banked: {ship.bankedCB})
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={createPool}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        disabled={selectedShips.length === 0}
      >
        Create Pool
      </button>

      {poolResult && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Pool Result (Year {poolResult.year})</h3>
          <p className="mb-2 font-medium">
            Total CB:{" "}
            <span
              className={`${
                poolResult.totalCB >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {poolResult.totalCB.toFixed(2)}
            </span>
          </p>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Ship ID</th>
                <th className="border px-2 py-1">CB Before</th>
                <th className="border px-2 py-1">CB After</th>
              </tr>
            </thead>
            <tbody>
              {poolResult.members.map((m: any) => (
                <tr key={m.shipId}>
                  <td className="border px-2 py-1">{m.shipId}</td>
                  <td className="border px-2 py-1">{m.cb_before.toFixed(2)}</td>
                  <td
                    className={`border px-2 py-1 ${
                      m.cb_after >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {m.cb_after.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
