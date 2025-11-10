import React, { useEffect, useState } from "react";
import axios from "axios";

interface BankingRecord {
  id: string;
  year: number;
  action: "BANK" | "APPLY";
  amount: number;
  createdAt: string;
}

interface ShipCB {
  cb: number;
  bankedCB: number;
}

const Banking: React.FC = () => {
  const [shipId, setShipId] = useState(""); // selected ship
  const [year, setYear] = useState(new Date().getFullYear());
  const [cbData, setCbData] = useState<ShipCB>({ cb: 0, bankedCB: 0 });
  const [records, setRecords] = useState<BankingRecord[]>([]);
  const [amount, setAmount] = useState<number | "">("");

  const fetchRecords = async () => {
    if (!shipId) return;
    try {
      const res = await axios.get("/banking/records", { params: { shipId, year } });
      const data: BankingRecord[] = Array.isArray(res.data) ? res.data : [];

      setRecords(data);

      // Calculate CB from records
      const latestCB = data.reduce(
        (acc: ShipCB, rec: BankingRecord) => {
          if (rec.action === "BANK") {
            return { ...acc, cb: acc.cb - rec.amount, bankedCB: acc.bankedCB + rec.amount };
          }
          if (rec.action === "APPLY") {
            return { ...acc, cb: acc.cb + rec.amount, bankedCB: acc.bankedCB - rec.amount };
          }
          return acc;
        },
        { cb: 100, bankedCB: 0 } // initial dummy CB
      );

      setCbData(latestCB);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch records");
      setRecords([]);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [shipId, year]);

  const handleBank = async () => {
    if (!amount || amount <= 0) return alert("Enter a valid amount");
    try {
      const res = await axios.post("/banking/bank", { shipId, year, amount });
      alert(res.data.message);
      setAmount("");
      fetchRecords();
    } catch (err: any) {
      alert(err.response?.data?.error || "Bank failed");
    }
  };

  const handleApply = async () => {
    if (!amount || amount <= 0) return alert("Enter a valid amount");
    try {
      const res = await axios.post("/banking/apply", { shipId, year, amount });
      alert(res.data.message);
      setAmount("");
      fetchRecords();
    } catch (err: any) {
      alert(err.response?.data?.error || "Apply failed");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Banking Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Ship ID"
          value={shipId}
          onChange={(e) => setShipId(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex gap-4 mb-6 justify-center">
        <button
          onClick={handleBank}
          disabled={cbData.cb <= 0}
          className={`px-6 py-2 rounded text-white font-semibold transition-colors ${
            cbData.cb <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Bank
        </button>
        <button
          onClick={handleApply}
          disabled={cbData.bankedCB <= 0}
          className={`px-6 py-2 rounded text-white font-semibold transition-colors ${
            cbData.bankedCB <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Apply
        </button>
      </div>

      <div className="mb-6 text-center">
        <p className="text-lg">
          <span className="font-semibold">Current CB:</span> {cbData.cb.toFixed(2)}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Banked CB:</span> {cbData.bankedCB.toFixed(2)}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Year</th>
              <th className="border px-3 py-2 text-left">Action</th>
              <th className="border px-3 py-2 text-left">Amount</th>
              <th className="border px-3 py-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{rec.year}</td>
                  <td className="border px-3 py-2">{rec.action}</td>
                  <td className="border px-3 py-2">{rec.amount.toFixed(2)}</td>
                  <td className="border px-3 py-2">
                    {new Date(rec.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Banking;
