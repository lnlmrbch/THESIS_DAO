import React, { useEffect, useState } from "react";
import { providers } from "near-api-js";

export default function ProposalList({ selector, contractId, accountId }) {
  const [proposals, setProposals] = useState([]);

  const fetchProposals = async () => {
    const provider = new providers.JsonRpcProvider({ url: "https://rpc.testnet.near.org" });

    const res = await provider.query({
      request_type: "call_function",
      account_id: contractId,
      method_name: "get_proposals",
      args_base64: "",
      finality: "optimistic",
    });

    const decoded = new TextDecoder().decode(Uint8Array.from(res.result));
    setProposals(JSON.parse(decoded));
  };

  const vote = async (proposal_id, support) => {
    const wallet = await selector.wallet();
    await wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "vote_on_proposal",
            args: { proposal_id, support },
            gas: "30000000000000",
            deposit: "1",
          },
        },
      ],
    });

    fetchProposals(); // Refresh after vote
  };

  useEffect(() => {
    if (contractId) fetchProposals();
  }, [contractId]);

  return (
    <div>
      <h3>📋 Proposals</h3>
      {proposals.length === 0 ? (
        <p>Keine Proposals vorhanden.</p>
      ) : (
        <ul>
          {proposals.map((proposal) => (
            <li key={proposal.id}>
              <strong>#{proposal.id}</strong>: {proposal.description}
              <br />
              <button onClick={() => vote(proposal.id, true)}>👍 Ja</button>
              <button onClick={() => vote(proposal.id, false)}>👎 Nein</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
