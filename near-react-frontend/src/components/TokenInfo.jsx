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
          const decoded = new TextDecoder().decode(new Uint8Array(raw));
          return JSON.parse(decoded);
        } catch (err) {
          console.error(`Fehler bei ${method}:`, err);
          return null;
        }
      };

      if (accountId && contractId) {
        const [bal, supply, meta] = await Promise.all([
          fetchView("ft_balance_of", { account_id: accountId }),
          fetchView("ft_total_supply"),
          fetchView("ft_metadata"),
        ]);

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
    <section className="max-w-6xl mx-auto px-6 mt-12">
      <div className="bg-white text-black rounded-xl shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-primary text-3xl">💰</span> Token Details
        </h2>

        {metadata ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium">{metadata.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Symbol</p>
              <p className="font-medium">{metadata.symbol}</p>
            </div>
            <div>
              <p className="text-gray-500">Decimals</p>
              <p className="font-medium">{metadata.decimals}</p>
            </div>
            <div>
              <p className="text-gray-500">Total Supply</p>
              <p className="font-semibold text-gray-800">
                {formatAmount(totalSupply)} {metadata.symbol}
              </p>
            </div>
            <div className="sm:col-span-2 md:col-span-3">
              <p className="text-gray-500">Your Balance</p>
              <p className="text-xl font-bold text-primary">
                {formatAmount(balance)} {metadata.symbol}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Lade Token-Daten...</p>
        )}
      </div>
    </section>
  );
};

export default TokenInfo;