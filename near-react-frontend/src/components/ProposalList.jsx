import React, { useEffect, useState } from "react";

export default function ProposalList({ selector, contractId, accountId }) {
  const [proposals, setProposals] = useState([]);
  const [userBalance, setUserBalance] = useState("0");
  const [error, setError] = useState(null);

  const fetchProposals = async () => {
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
            method_name: "get_proposals",
            args_base64: "",
            finality: "optimistic",
          },
        }),
      });

      const data = await res.json();
      const raw = data?.result?.result;
      if (!raw) throw new Error("Leere Antwort bei get_proposals");

      const decoded = new TextDecoder().decode(Uint8Array.from(raw));
      const parsed = JSON.parse(decoded);

      setProposals(parsed);
    } catch (err) {
      console.error("Fehler beim Abrufen der Proposals:", err);
      setError("⚠️ Fehler beim Laden der Proposals.");
    }
  };

  const fetchUserBalance = async () => {
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
            method_name: "ft_balance_of",
            args_base64: btoa(JSON.stringify({ account_id: accountId })),
            finality: "optimistic",
          },
        }),
      });

      const data = await res.json();
      const raw = data?.result?.result;
      if (!raw) throw new Error("Leere Antwort bei ft_balance_of");

      const decoded = new TextDecoder().decode(Uint8Array.from(raw));
      setUserBalance(decoded);
    } catch (err) {
      console.error("Fehler beim Abrufen der User Balance:", err);
      setError("⚠️ Fehler beim Laden des Kontostands.");
    }
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
    fetchProposals();
  };

  const finalize = async (proposal_id) => {
    const wallet = await selector.wallet();
    await wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "finalize_proposal",
            args: { proposal_id },
            gas: "30000000000000",
            deposit: "0",
          },
        },
      ],
    });
    fetchProposals();
  };

  const formatYocto = (amount) => (parseFloat(amount) / 1e24).toFixed(2);

  useEffect(() => {
    fetchProposals();
    fetchUserBalance();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-cardbg border border-gray-700 rounded-xl p-6 shadow-xl text-white">
        <h3 className="text-3xl font-bold mb-2">📋 Proposals</h3>
        {error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <p className="text-sm text-gray-400">
            🧾 <strong className="text-white">Your Token Balance:</strong> {formatYocto(userBalance)} Ⓝ
          </p>
        )}
      </div>

      {error ? (
        <p className="text-center text-red-400">{error}</p>
      ) : proposals.length === 0 ? (
        <p className="text-center text-gray-500">No proposals yet.</p>
      ) : (
        <ul className="space-y-6">
          {proposals.map((proposal) => {
            const votesFor = proposal.votes_for.reduce((acc, [, w]) => acc + parseInt(w), 0);
            const votesAgainst = proposal.votes_against.reduce((acc, [, w]) => acc + parseInt(w), 0);

            return (
              <li key={proposal.id} className="bg-cardbg border border-gray-700 rounded-xl p-6 shadow-md text-white">
                <div className="mb-4">
                  <span className="text-sm text-gray-500">Proposal #{proposal.id}</span>
                  <h4 className="text-xl font-semibold mt-1">{proposal.description}</h4>
                </div>

                <div className="text-sm text-gray-400 space-y-1 mb-4">
                  <div><strong>Status:</strong> {proposal.status}</div>
                  <div>👍 Yes: {proposal.votes_for.length} vote(s), {formatYocto(votesFor)} Ⓝ</div>
                  <div>👎 No: {proposal.votes_against.length} vote(s), {formatYocto(votesAgainst)} Ⓝ</div>
                </div>

                {proposal.status === "Open" && (
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => vote(proposal.id, true)}
                      className="px-5 py-2 bg-gradient-to-r from-green-400 to-accent text-black font-semibold rounded-full shadow hover:brightness-110 transition"
                    >
                      👍 Vote Yes
                    </button>
                    <button
                      onClick={() => vote(proposal.id, false)}
                      className="px-5 py-2 bg-gradient-to-r from-red-400 to-pink-500 text-black font-semibold rounded-full shadow hover:brightness-110 transition"
                    >
                      👎 Vote No
                    </button>
                    <button
                      onClick={() => finalize(proposal.id)}
                      className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-full shadow transition"
                    >
                      ✅ Finalize
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
