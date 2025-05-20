import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const CreateProposalForm = ({ selector, contractId }) => {
  const [description, setDescription] = useState("");

  const submitProposal = async () => {
    if (!description.trim()) return;
    const wallet = await selector.wallet();
    const accountId = await wallet.getAccounts().then((a) => a[0].accountId);

    try {
      await wallet.signAndSendTransaction({
        signerId: accountId,
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

      // API-Aufruf zur Aktivitätsaufzeichnung
      const API_URL = process.env.REACT_APP_API_URL || "";
      await fetch(`${API_URL}/api/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId,
          type: "proposal",
          description: `Proposal erstellt: "${description}"`,
          timestamp: new Date().toISOString(),
        }),
      });

      setDescription("");
    } catch (err) {
      console.error("❌ Fehler beim Erstellen des Vorschlags:", err);
    }
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
        className="w-full modern-button"
      >
        <FaPlus className="mr-2" /> Vorschlag einreichen
      </button>
    </div>
  );
};

export default CreateProposalForm;