import React, { useEffect, useState } from "react";
import { providers } from "near-api-js";

const TokenInfo = ({ accountId, contractId }) => {
  const [balance, setBalance] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const provider = new providers.JsonRpcProvider("https://rpc.testnet.near.org");

      const fetchView = async (method, args = {}) => {
        try {
          const res = await provider.query({
            request_type: "call_function",
            account_id: contractId,
            method_name: method,
            args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
            finality: "final",
          });

          const raw = res?.result;
          if (!raw) {
            console.error(`Empty result for method ${method}`);
            return null;
          }

          const decoded = new TextDecoder().decode(new Uint8Array(raw));
          return JSON.parse(decoded);
        } catch (err) {
          console.error(`Error fetching ${method}:`, err);
          return null;
        }
      };

      try {
        const bal = await fetchView("ft_balance_of", { account_id: accountId });
        const supply = await fetchView("ft_total_supply");
        const meta = await fetchView("ft_metadata");

        setBalance(bal);
        setTotalSupply(supply);
        setMetadata(meta);
      } catch (err) {
        console.error("Smart contract view call failed:", err);
      }
    };

    if (accountId && contractId) {
      fetchData();
    }
  }, [accountId, contractId]);

  const formatAmount = (amount) => {
    if (!metadata || !amount) return "0.00";
    return (parseFloat(amount) / Math.pow(10, metadata.decimals)).toFixed(2);
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-8 bg-cardbg border border-gray-700 rounded-xl shadow-xl text-white">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <span className="text-accent">📊</span> Token Info
      </h2>

      {metadata ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <p className="text-gray-400">Name</p>
            <p className="font-medium text-white">{metadata.name}</p>
          </div>
          <div>
            <p className="text-gray-400">Symbol</p>
            <p className="font-medium text-white">{metadata.symbol}</p>
          </div>
          <div>
            <p className="text-gray-400">Decimals</p>
            <p className="font-medium text-white">{metadata.decimals}</p>
          </div>
          <div>
            <p className="text-gray-400">Total Supply</p>
            <p className="font-medium text-white">
              {formatAmount(totalSupply)} {metadata.symbol}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-400">Your Balance</p>
            <p className="text-xl font-semibold text-accent">
              {formatAmount(balance)} {metadata.symbol}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading token data...</p>
      )}
    </div>
  );
};

export default TokenInfo;
