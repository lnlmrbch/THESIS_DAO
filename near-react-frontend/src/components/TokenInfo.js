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
        const res = await provider.query({
          request_type: "call_function",
          account_id: contractId,
          method_name: method,
          args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
          finality: "final",
        });

        return JSON.parse(Buffer.from(res.result).toString());
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

  return (
    <div style={{ marginTop: 24 }}>
      <h2>📊 Token Info</h2>
      {metadata && (
        <>
          <p><strong>Name:</strong> {metadata.name}</p>
          <p><strong>Symbol:</strong> {metadata.symbol}</p>
          <p><strong>Decimals:</strong> {metadata.decimals}</p>
        </>
      )}
      <p><strong>Total Supply:</strong> {totalSupply}</p>
      <p><strong>Your Balance:</strong> {balance}</p>
    </div>
  );
};

export default TokenInfo;
