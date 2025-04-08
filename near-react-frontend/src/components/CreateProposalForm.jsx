import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function CreateProposalForm({ selector, contractId }) {
  const [description, setDescription] = useState("");

  const submitProposal = async () => {
    if (!description) return;
    const wallet = await selector.wallet();
    await wallet.signAndSendTransaction({
      signerId: wallet.accountId,
      receiverId: contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "create_proposal",
            args: { description },
            gas: "30000000000000",
            deposit: "10000000000000000000000", // 0.01 NEAR
          },
        },
      ],
    });
    setDescription("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm px-6 py-6">
      <div className="flex items-center gap-2 mb-4">
        <FaPlus className="text-primary" />
        <h3 className="text-lg font-semibold text-gray-800">
          Proposal erstellen
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1">
            Beschreibung
          </label>
          <input
            type="text"
            placeholder="z.B. Budget freigeben für..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm text-gray-800 placeholder-gray-400 focus:ring-primary focus:border-primary transition"
          />
        </div>
        <button
          onClick={submitProposal}
          className="w-full bg-primary hover:brightness-105 text-white font-semibold py-2 rounded-md transition"
        >
          Vorschlag einreichen
        </button>
      </div>
    </div>
  );
}