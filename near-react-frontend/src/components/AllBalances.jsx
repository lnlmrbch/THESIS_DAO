import React, { useEffect, useState } from "react";
import { providers } from "near-api-js";

export default function AllBalances({ selector, contractId }) {
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    const fetchBalances = async () => {
      const provider = new providers.JsonRpcProvider("https://rpc.testnet.near.org");
      const res = await provider.query({
        request_type: "call_function",
        account_id: contractId,
        method_name: "get_all_balances",
        args_base64: Buffer.from(JSON.stringify({})).toString("base64"),
        finality: "optimistic",
      });

      const raw = res?.result;
      if (!raw) return;
      const decoded = new TextDecoder().decode(new Uint8Array(raw));
      const parsed = JSON.parse(decoded);
      setBalances(parsed);
    };

    fetchBalances();
  }, [contractId]);

  return (
    <section className="max-w-6xl mx-auto mt-16 px-6">
      <h3 className="text-2xl font-semibold text-[#2c1c5b] mb-6">📊 Alle Token-Balances</h3>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-[#2c1c5b] border-b border-gray-200">
              <th className="py-2">Account</th>
              <th className="py-2">Balance (LIONEL)</th>
            </tr>
          </thead>
          <tbody>
            {balances.map(([account, amount], index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="py-2 text-gray-700">{account}</td>
                <td className="py-2 font-medium text-[#3c228c]">
                  {(parseFloat(amount) / 1e24).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}