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
      const res = await axios.get(`/banking/records`, {
        params: { shipId, year },
      });
      setRecords(res.data);
      // fetch current CB from last record or separate API if needed
      const latestCB = res.data.reduce(
        (acc: ShipCB, rec: BankingRecord) => {
          if (rec.action === "BANK") {
            return { ...acc, cb: acc.cb - rec.amount, bankedCB: acc.bankedCB + rec.amount };
          }
          if (rec.action === "APPLY") {
            return { ...acc, cb: acc.cb + rec.amount, bankedCB: acc.bankedCB - rec.amount };
          }
          return acc;
        },
        { cb: 100, bankedCB: 0 } // default initial CB
      );
      setCbData(latestCB);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch records");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [shipId, year]);

  const handleBank = async () => {
    if (!amount || amount <= 0) return alert("Enter a valid amount");
    try {
      const res = await axios.post(`/banking/bank`, { shipId, year, amount });
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
      const res = await axios.post(`/banking/apply`, { shipId, year, amount });
      alert(res.data.message);
      setAmount("");
      fetchRecords();
    } catch (err: any) {
      alert(err.response?.data?.error || "Apply failed");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Banking Tab</h1>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Ship ID"
          value={shipId}
          onChange={(e) => setShipId(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        />
      </div>

      <div className="mb-4">
        <p>Current CB: {cbData.cb.toFixed(2)}</p>
        <p>Banked CB: {cbData.bankedCB.toFixed(2)}</p>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border px-2 py-1 rounded w-32"
        />
        <button
          onClick={handleBank}
          disabled={cbData.cb <= 0}
          className={`px-4 py-2 rounded text-white ${
            cbData.cb <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Bank
        </button>
        <button
          onClick={handleApply}
          disabled={cbData.bankedCB <= 0}
          className={`px-4 py-2 rounded text-white ${
            cbData.bankedCB <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Apply
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Year</th>
            <th className="border px-2 py-1">Action</th>
            <th className="border px-2 py-1">Amount</th>
            <th className="border px-2 py-1">Created At</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec.id}>
              <td className="border px-2 py-1">{rec.year}</td>
              <td className="border px-2 py-1">{rec.action}</td>
              <td className="border px-2 py-1">{rec.amount.toFixed(2)}</td>
              <td className="border px-2 py-1">{new Date(rec.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Banking;
