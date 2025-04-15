// src/components/AllBalances.js
import React, { useEffect, useState } from "react";
import { providers } from "near-api-js";
import { FaUser, FaCoins, FaUserShield } from "react-icons/fa";

export default function AllBalances({ contractId }) {
  const [balances, setBalances] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const provider = new providers.JsonRpcProvider("https://rpc.testnet.near.org");

      // Token balances
      const balanceRes = await provider.query({
        request_type: "call_function",
        account_id: contractId,
        method_name: "get_all_balances",
        args_base64: Buffer.from(JSON.stringify({})).toString("base64"),
        finality: "optimistic",
      });

      const decodedBalances = new TextDecoder().decode(new Uint8Array(balanceRes.result));
      const balancesParsed = JSON.parse(decodedBalances);

      setBalances(balancesParsed);

      // Roles
      const roleRes = await provider.query({
        request_type: "call_function",
        account_id: contractId,
        method_name: "get_all_roles",
        args_base64: Buffer.from(JSON.stringify({})).toString("base64"),
        finality: "optimistic",
      });

      const decodedRoles = new TextDecoder().decode(new Uint8Array(roleRes.result));
      const rolesParsed = JSON.parse(decodedRoles);
      setRoles(rolesParsed);
    };

    fetchData();
  }, [contractId]);

  const getRoleForAccount = (accountId) => {
    const roleEntry = roles.find(([acc]) => acc === accountId);
    return roleEntry ? roleEntry[1] : "-";
  };

  return (
    <section className="max-w-6xl mx-auto mt-16 px-6">
      <h3 className="text-2xl font-semibold text-[#2c1c5b] mb-6 flex items-center gap-2">
        <FaCoins className="text-[#3c228c]" /> Alle Token-Balances & Rollen
      </h3>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="text-[#3c228c] border-b border-gray-200">
            <tr>
              <th className="py-3 px-4"><FaUser className="inline mr-2" />Account</th>
              <th className="py-3 px-4"><FaCoins className="inline mr-2" />Balance (LIONEL)</th>
              <th className="py-3 px-4"><FaUserShield className="inline mr-2" />Rolle</th>
            </tr>
          </thead>
          <tbody>
            {balances.map(([account, rawBalance], index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4 text-gray-800">{account}</td>
                <td className="py-3 px-4 text-[#3c228c] font-medium">
                  {(parseFloat(rawBalance) / 1e24).toFixed(2)}
                </td>
                <td className="py-3 px-4 text-gray-600">{getRoleForAccount(account)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}