// src/components/Pooling.tsx
import { useState } from "react";

type Ship = { id: string; name: string; cb: number; bankedCB: number };

export default function Pooling() {
  // Dummy ship data
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
    // Simulate pool calculation
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pooling </h2>

      <div className="mb-4">
        <label>Year: </label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="border p-1"
        />
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Select Ships:</h3>
        {ships.map((ship) => (
          <div key={ship.id}>
            <input
              type="checkbox"
              checked={!!selectedShips.find((s) => s.shipId === ship.id)}
              onChange={() => toggleShip(ship)}
            />
            {ship.name} (CB: {ship.cb}, Banked: {ship.bankedCB})
          </div>
        ))}
      </div>

      <button onClick={createPool} className="bg-blue-500 text-white p-2 rounded">
        Create Pool
      </button>

      {poolResult && (
        <div className="mt-4">
          <h3 className="font-semibold">Pool Result</h3>
          <pre>{JSON.stringify(poolResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
