// src/components/DaoSettings.js
import React, { useState } from "react";

const DaoSettings = ({ selector, accountId, contractId }) => {
  const [minDeposit, setMinDeposit] = useState("");
  const [votingDuration, setVotingDuration] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async () => {
    try {
      const wallet = await selector.wallet();
      await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: contractId,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "update_settings",
              args: {
                min_proposal_deposit: minDeposit,
                voting_duration_sec: votingDuration,
              },
              gas: "30000000000000",
              deposit: "1",
            },
          },
        ],
      });
      setStatus("✅ Einstellungen aktualisiert.");
    } catch (err) {
      console.error("❌ Fehler beim Aktualisieren:", err);
      setStatus("❌ Fehler beim Speichern.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <h2 className="text-xl font-bold text-[#2c1c5b]">🛠 DAO Einstellungen</h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Minimale Deposit für Proposal (NEAR)</label>
          <input
            type="number"
            value={minDeposit}
            onChange={(e) => setMinDeposit(e.target.value)}
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Voting-Dauer (Sekunden)</label>
          <input
            type="number"
            value={votingDuration}
            onChange={(e) => setVotingDuration(e.target.value)}
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:brightness-110 transition"
        >
          Speichern
        </button>

        {status && <p className="text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  );
};

export default DaoSettings;