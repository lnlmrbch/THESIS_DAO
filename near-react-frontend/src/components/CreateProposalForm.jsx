import React, { useState } from "react";

const CreateProposalForm = ({ selector, contractId }) => {
  const [description, setDescription] = useState("");

  const submitProposal = async () => {
    if (!description.trim()) return;
    const wallet = await selector.wallet();
    await wallet.signAndSendTransaction({
      signerId: await wallet.getAccounts().then((a) => a[0].accountId),
      receiverId: contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "create_proposal",
            args: { description },
            gas: "30000000000000",
            deposit: "1000000000000000000000", // 0.001 NEAR
          },
        },
      ],
    });
    setDescription("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
        Beschreibung
      </label>
      <input
        type="text"
        id="description"
        placeholder="z.B. Budget freigeben für..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-4 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary mb-6"
      />

      <button
        onClick={submitProposal}
        className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 rounded-md transition"
      >
        Vorschlag einreichen
      </button>
    </div>
  );
};

export default CreateProposalForm;