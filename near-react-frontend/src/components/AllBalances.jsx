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

  // Hilfsfunktion für exakte Umrechnung von Yocto zu Token
  function formatYoctoToToken(rawBalance, decimals = 24) {
    if (!rawBalance) return "0";
    try {
      // Convert to string first to preserve precision
      const balanceStr = rawBalance.toString();
      // Remove the last 24 characters (Yocto)
      const tokens = balanceStr.slice(0, -24);
      // Convert to number and format
      const value = Number(tokens);
      return value.toLocaleString("de-CH", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    } catch (e) {
      console.error("Error in formatYoctoToToken:", e);
      return "0";
    }
  }

  // Hilfsfunktion für Anzeige in Millionen
  function formatYoctoToMillions(rawBalance, decimals = 24) {
    try {
      // Convert to string first to preserve precision
      const balanceStr = rawBalance.toString();
      // Remove the last 24 characters (Yocto)
      const tokens = balanceStr.slice(0, -24);
      // Convert to number and calculate millions
      const value = Number(tokens);
      const inMillions = value / 1_000_000;
      return `${inMillions.toFixed(2)} Mio`;
    } catch (e) {
      console.error("Error in formatYoctoToMillions:", e);
      return "0 Mio";
    }
  }

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
            {balances.map(([account, rawBalance], index) => {
              const tokenAmount = formatYoctoToToken(rawBalance);
              const millionsAmount = formatYoctoToMillions(rawBalance);
              console.log(`Account: ${account} | RawBalance: ${rawBalance} | Tokens: ${tokenAmount} | Millions: ${millionsAmount}`);
              return (
                <tr
                  key={index}
                  className="hover:bg-gray-50/50 transition-colors duration-150"
                >
                  <td className="py-4 px-6 text-gray-800 font-medium">{account}</td>
                  <td className="py-4 px-6 text-[#6B46C1] font-semibold">
                    {tokenAmount} Tokens
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {getRoleForAccount(account)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}