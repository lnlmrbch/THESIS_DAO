// src/components/TokenInfo.js
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
          if (!raw) return null;
          const decoded = new TextDecoder().decode(new Uint8Array(raw));
          return JSON.parse(decoded);
        } catch (err) {
          console.error(`Error fetching ${method}:`, err);
          return null;
        }
      };

      if (accountId && contractId) {
        const bal = await fetchView("ft_balance_of", { account_id: accountId });
        const supply = await fetchView("ft_total_supply");
        const meta = await fetchView("ft_metadata");

        setBalance(bal);
        setTotalSupply(supply);
        setMetadata(meta);
      }
    };

    fetchData();
  }, [accountId, contractId]);

  const formatAmount = (amount) => {
    if (!metadata || !amount) return "0.00";
    return (parseFloat(amount) / Math.pow(10, metadata.decimals)).toFixed(2);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-800">
      {metadata ? (
        <>
          <div className="space-y-1">
            <p className="text-gray-500">Name</p>
            <p className="text-[#2c1c5b] font-semibold">{metadata.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Symbol</p>
            <p className="text-[#2c1c5b] font-semibold">{metadata.symbol}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Decimals</p>
            <p className="text-[#2c1c5b] font-semibold">{metadata.decimals}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Total Supply</p>
            <p className="text-[#2c1c5b] font-semibold">
              {formatAmount(totalSupply)} {metadata.symbol}
            </p>
          </div>
          <div className="space-y-1 col-span-2">
            <p className="text-gray-500">Your Balance</p>
            <p className="text-primary text-lg font-bold">
              {formatAmount(balance)} {metadata.symbol}
            </p>
          </div>
        </>
      ) : (
        <p className="text-gray-400">Token-Daten werden geladen...</p>
      )}
    </div>
  );
};

export default TokenInfo;