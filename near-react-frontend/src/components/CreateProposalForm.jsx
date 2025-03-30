import React, { useState } from "react";

export default function CreateProposalForm({ selector, contractId }) {
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const wallet = await selector.wallet();
    await wallet.signAndSendTransaction({
      signerId: wallet.accountId,
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
      receiverId: contractId,
    });
    setDescription("");
    alert("Proposal submitted!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-cardbg text-white rounded-xl p-8 border border-gray-700 shadow-xl backdrop-blur-md"
    >
      <h3 className="text-3xl font-bold mb-6 text-white flex items-center">
        <span className="text-accent mr-3 text-4xl">➕</span> Create Proposal
      </h3>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your proposal idea..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-5 py-3 bg-gray-800 border border-gray-600 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-400"
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-400 to-accent text-black font-semibold py-3 rounded-full shadow-lg hover:brightness-110 transition"
        >
          Submit Proposal
        </button>
      </div>
    </form>
  );
}
