// src/components/DaoSettings.js
import React, { useState } from "react";
import { FaTools, FaCoins, FaClock, FaSave, FaTimes } from "react-icons/fa";

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
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
            <FaCoins className="text-[#6B46C1]" />
            Minimale Deposit für Proposal (NEAR)
          </label>
          <input
            type="number"
            value={minDeposit}
            onChange={(e) => setMinDeposit(e.target.value)}
            className="w-full p-3 bg-white/80 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent transition-all"
            placeholder="z.B. 0.01"
          />
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
            <FaClock className="text-[#6B46C1]" />
            Voting-Dauer (Sekunden)
          </label>
          <input
            type="number"
            value={votingDuration}
            onChange={(e) => setVotingDuration(e.target.value)}
            className="w-full p-3 bg-white/80 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent transition-all"
            placeholder="z.B. 86400 (für 24 Stunden)"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => {
            setMinDeposit("");
            setVotingDuration("");
            setStatus(null);
          }}
          className="modern-button bg-gray-600 hover:bg-gray-500"
        >
          <FaTimes className="mr-2" /> Zurücksetzen
        </button>
        <button
          onClick={handleSubmit}
          className="modern-button"
        >
          <FaSave className="mr-2" /> Speichern
        </button>
      </div>

      {status && (
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-[#6B46C1]">{status}</p>
        </div>
      )}
    </div>
  );
};

export default DaoSettings;