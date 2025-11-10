import { useEffect, useState } from "react";
import axios from "axios";

interface BankingRecord {
  id: string;
  year: number;
  action: string;
  amount: number;
  createdAt: string;
}

interface Ship {
  id: string;
  name: string;
  cb: number;
  bankedCB: number;
}

export default function BankingTab() {
  const [ship, setShip] = useState<Ship | null>(null);
  const [records, setRecords] = useState<BankingRecord[]>([]);
  const [amount, setAmount] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch the first ship just for demo
    axios.get("http://localhost:5000/ships").then((res) => {
      setShip(res.data[0]);
    });
  }, []);

  useEffect(() => {
    if (ship) {
      axios
        .get(`http://localhost:5000/banking/records?shipId=${ship.id}&year=${year}`)
        .then((res) => setRecords(res.data));
    }
  }, [ship, year]);

  const handleBank = async () => {
    try {
      const res = await axios.post("http://localhost:5000/banking/bank", {
        shipId: ship?.id,
        year,
        amount: parseFloat(amount),
      });
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Banking failed");
    }
  };

  const handleApply = async () => {
    try {
      const res = await axios.post("http://localhost:5000/banking/apply", {
        shipId: ship?.id,
        year,
        amount: parseFloat(amount),
      });
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Apply failed");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-center">FuelEU Banking</h1>

      {ship ? (
        <>
          <div className="mb-4">
            <p>Ship: <b>{ship.name}</b></p>
            <p>CB: <b>{ship.cb}</b></p>
            <p>Banked CB: <b>{ship.bankedCB}</b></p>
          </div>

          <div className="flex gap-3 mb-4">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border px-3 py-2 rounded w-40"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleBank}
              disabled={!ship || ship.cb <= 0}
            >
              Bank CB
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleApply}
              disabled={!ship || ship.bankedCB <= 0}
            >
              Apply Banked CB
            </button>
          </div>

          {message && <p className="text-blue-600 mb-4">{message}</p>}

          <h3 className="font-semibold text-lg mb-2">Banking History</h3>
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Action</th>
                <th className="border px-3 py-2">Amount</th>
                <th className="border px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="border px-3 py-2">{r.action}</td>
                  <td className="border px-3 py-2">{r.amount}</td>
                  <td className="border px-3 py-2">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="text-center text-gray-500">Loading ship data...</p>
      )}
    </div>
  );
}
