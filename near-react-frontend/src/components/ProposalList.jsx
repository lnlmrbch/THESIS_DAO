import React from "react";

export default function ProposalList({
  selector,
  contractId,
  accountId,
  metadata,
  userBalance,
  totalSupply,
  proposals,
}) {
  const formatYocto = (amount) => {
    if (!amount || isNaN(amount)) return "0.00";
    return (parseFloat(amount) / 1e24).toFixed(2);
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
  };

  return (
    <section className="max-w-6xl mx-auto mt-16 px-6 space-y-12">
      <div className="text-black">
        <h3 className="text-2xl font-semibold mb-1">🗳 Proposals</h3>
        <p className="text-sm text-gray-500">
          Dein Stimmrecht:{" "}
          <span className="text-primary font-semibold">
            {formatYocto(userBalance)} / {formatYocto(totalSupply)} {metadata?.symbol || "TOKEN"}
          </span>
        </p>
      </div>

      {proposals.length === 0 ? (
        <p className="text-center text-gray-500">Noch keine Proposals vorhanden.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {proposals.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  #{p.id} ·{" "}
                  <span className="text-primary font-medium">{p.description}</span>
                </h4>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium tracking-wide ${
                    p.status === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : p.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              {p.status === "Open" && (
                <div className="flex gap-3 flex-wrap mt-4">
                  <button
                    onClick={() => vote(p.id, true)}
                    className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:brightness-110"
                  >
                    👍 Ja
                  </button>
                  <button
                    onClick={() => vote(p.id, false)}
                    className="px-4 py-2 bg-secondary text-white rounded-md font-medium hover:brightness-110"
                  >
                    👎 Nein
                  </button>
                  <button
                    onClick={() => finalize(p.id)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    ✅ Finalisieren
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}