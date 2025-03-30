import React, { useEffect, useState } from "react";

export default function AllBalances({ selector, contractId }) {
  const [balances, setBalances] = useState([]);
  const [error, setError] = useState(null);

  const fetchBalances = async () => {
    try {
      const { network } = await selector.store.getState();
      const provider = selector.options.network.nodeUrl;

      const res = await fetch(provider, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "dontcare",
          method: "query",
          params: {
            request_type: "call_function",
            account_id: contractId,
            method_name: "get_all_balances",
            args_base64: "",
            finality: "optimistic",
          },
        }),
      });

      const data = await res.json();

      const raw = data?.result?.result;
      if (!raw) {
        throw new Error("Leeres Ergebnis vom Smart Contract");
      }

      const decoded = new TextDecoder().decode(Uint8Array.from(raw));
      const parsed = JSON.parse(decoded);

      setBalances(parsed);
    } catch (err) {
      console.error("Fehler beim Abrufen der Token-Balances:", err);
      setError("⚠️ Konnte Token-Balances nicht laden.");
    }
  };

  const formatYocto = (amount) => (parseFloat(amount) / 1e24).toFixed(2);

  useEffect(() => {
    fetchBalances();
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 text-white p-6 mt-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">👥 All Token Holders</h2>

      {error ? (
        <p className="text-red-400">{error}</p>
      ) : balances.length === 0 ? (
        <p className="text-gray-400">No balances found.</p>
      ) : (
        <ul className="space-y-2">
          {balances.map(([account, amount], i) => (
            <li key={i} className="flex justify-between border-b border-gray-700 py-2">
              <span>{account}</span>
              <span className="text-accent">{formatYocto(amount)} LIONEL</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
