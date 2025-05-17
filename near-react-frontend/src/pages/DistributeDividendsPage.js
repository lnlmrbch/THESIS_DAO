// src/pages/DistributeDividendsPage.js
import React, { useState, useEffect } from "react";
import { FaMoneyBillWave, FaUsers, FaCheckCircle } from "react-icons/fa";
import { providers } from "near-api-js";

export default function DistributeDividendsPage({ selector, accountId, contractId }) {
  const [totalAmount, setTotalAmount] = useState("");
  const [preview, setPreview] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBalances = async () => {
    try {
      setLoading(true);
      const provider = new providers.JsonRpcProvider("https://rpc.testnet.near.org");
      const res = await provider.query({
        request_type: "call_function",
        account_id: contractId,
        method_name: "get_all_balances",
        args_base64: btoa(JSON.stringify({})),
        finality: "optimistic",
      });

      const raw = res?.result;
      const decoded = new TextDecoder().decode(new Uint8Array(raw));
      const balances = JSON.parse(decoded);
      return balances;
    } catch (e) {
      console.error("Fehler beim Laden der Balances:", e);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    const parsedAmount = parseFloat(totalAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Bitte gib einen gültigen Betrag ein.");
      return;
    }

    const allBalances = await fetchBalances();
    const totalSupply = allBalances.reduce((acc, [_, amount]) => acc + parseFloat(amount), 0);

    const shares = allBalances.map(([account, amount]) => {
      const share = (parseFloat(amount) / totalSupply) * parsedAmount;
      return { account, share };
    });

    setPreview(shares);
  };

  const distribute = async () => {
    try {
      const wallet = await selector.wallet();
      const yoctoAmount = BigInt(parseFloat(totalAmount) * 1e24).toString();
      await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: contractId,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "distribute_dividends",
              args: {},
              gas: "30000000000000",
              deposit: yoctoAmount,
            },
          },
        ],
      });
      setStatus("✅ Gewinne erfolgreich ausgeschüttet.");
    } catch (err) {
      console.error("Fehler beim Ausschütten:", err);
      setStatus("❌ Fehler beim Ausschütten.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-black px-6 py-12 m-full">
      <h1 className="text-3xl font-bold text-[#2c1c5b] flex items-center gap-2">
        <FaMoneyBillWave className="text-[#6B46C1]" /> Gewinne ausschütten
      </h1>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gesamtgewinn in NEAR</label>
          <input
            type="number"
            placeholder="z.B. 100"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <button
          onClick={handlePreview}
          className="w-full py-3 bg-[#6B46C1] hover:bg-[#5A38A9] text-white font-semibold rounded-md"
        >
          Vorschau anzeigen
        </button>
      </div>

      {preview.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#2c1c5b] flex items-center gap-2">
            <FaUsers /> Vorschau der Verteilung
          </h2>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-700 border-b">
                  <th className="py-2">Account</th>
                  <th className="py-2">Anteil (NEAR)</th>
                </tr>
              </thead>
              <tbody>
                {preview.map(({ account, share }) => (
                  <tr key={account} className="border-b">
                    <td className="py-2">{account}</td>
                    <td className="py-2 font-medium text-[#3c228c]">{share.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={distribute}
            className="w-full modern-button"
          >
            <FaCheckCircle /> Gewinne auszahlen
          </button>

          {status && <p className="text-sm text-[#6B46C1]">{status}</p>}
        </div>
      )}
    </div>
  );
}