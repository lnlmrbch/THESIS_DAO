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
    <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200">
              <th className="py-4 px-6 text-left font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <FaUser className="text-[#6B46C1]" />
                  Account
                </div>
              </th>
              <th className="py-4 px-6 text-left font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <FaCoins className="text-[#6B46C1]" />
                  Balance (THESISDAO)
                </div>
              </th>
              <th className="py-4 px-6 text-left font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <FaUserShield className="text-[#6B46C1]" />
                  Rolle
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {balances.map(([account, rawBalance], index) => (
              <tr
                key={index}
                className="hover:bg-gray-50/50 transition-colors duration-150"
              >
                <td className="py-4 px-6 text-gray-800 font-medium">{account}</td>
                <td className="py-4 px-6 text-[#6B46C1] font-semibold">
                  {(parseFloat(rawBalance) / 1e24).toFixed(2)}
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {getRoleForAccount(account)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}