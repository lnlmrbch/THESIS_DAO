// src/components/CreateProposalForm.jsx
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
    <form onSubmit={handleSubmit}>
      <h3>➕ Create Proposal</h3>
      <input
        type="text"
        placeholder="Proposal description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">Submit Proposal</button>
    </form>
  );
}
