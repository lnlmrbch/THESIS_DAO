import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "";

const CreateProposalForm = ({ selector, contractId }) => {
  const [description, setDescription] = useState("");
  const [targetAccount, setTargetAccount] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/team`);
        if (!res.ok) throw new Error("Fehler beim Laden der Team-Mitglieder");
        const team = await res.json();
        setTeamMembers(team.map(m => m.accountId));
      } catch (e) {
        setTeamMembers([]);
      }
    };
    loadTeamMembers();
  }, []);

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
              args: { description, target_account: targetAccount || undefined },
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
      setTargetAccount("");
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

      <label htmlFor="targetAccount" className="block text-gray-700 font-medium mb-2">
        Zieladresse (Team-Mitglied)
      </label>
      <select
        id="targetAccount"
        value={targetAccount}
        onChange={e => setTargetAccount(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary mb-2"
      >
        <option value="">Team-Mitglied auswählen…</option>
        {teamMembers.map(acc => (
          <option key={acc} value={acc}>{acc}</option>
        ))}
      </select>
      <div className="text-xs text-gray-500 mb-2">Oder manuell eingeben:</div>
      <input
        type="text"
        placeholder="NEAR AccountId manuell eingeben"
        value={targetAccount}
        onChange={e => setTargetAccount(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary mb-6"
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