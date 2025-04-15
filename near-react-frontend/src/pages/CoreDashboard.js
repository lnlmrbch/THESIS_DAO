// src/pages/CoreDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AllBalances from "../components/AllBalances";
import DaoSettings from "../components/DaoSettings";
import { FaUserPlus, FaUserShield, FaCheckCircle } from "react-icons/fa";

export default function CoreDashboard({ selector, accountId, contractId, userRole }) {
  const [roleToAssign, setRoleToAssign] = useState("");
  const [targetAccount, setTargetAccount] = useState("");
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== "core") {
      navigate("/");
    }
  }, [userRole, navigate]);

  const assignRole = async () => {
    if (!targetAccount || !roleToAssign) {
      alert("Bitte alle Felder ausfüllen.");
      return;
    }

    try {
      const wallet = await selector.wallet();
      await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: contractId,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "assign_role",
              args: {
                account_id: targetAccount,
                role: roleToAssign.toLowerCase(),
              },
              gas: "30000000000000",
              deposit: "1",
            },
          },
        ],
      });
      setStatus(`✅ Rolle "${roleToAssign}" wurde zugewiesen an ${targetAccount}`);
      setTargetAccount("");
      setRoleToAssign("");
    } catch (err) {
      console.error("Fehler beim Zuweisen der Rolle:", err);
      setStatus("❌ Fehler beim Zuweisen der Rolle.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-black px-6 py-12 max-w-6xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-[#2c1c5b] flex items-center gap-3">
        <FaUserShield className="text-[#3c228c]" />
        Core Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rolle zuweisen */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4">
          <h2 className="text-xl font-semibold text-[#2c1c5b] flex items-center gap-2">
            <FaUserPlus className="text-[#3c228c]" />
            Rolle zuweisen
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Ziel-Account ID
            </label>
            <input
              type="text"
              placeholder="z.B. user.testnet"
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
              value={targetAccount}
              onChange={(e) => setTargetAccount(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Rolle auswählen
            </label>
            <select
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
              value={roleToAssign}
              onChange={(e) => setRoleToAssign(e.target.value)}
            >
              <option value="">-- Rolle auswählen --</option>
              <option value="core">Core</option>
              <option value="community">Community</option>
              <option value="finance">Finance</option>
            </select>
          </div>

          <button
            onClick={assignRole}
            className="w-full py-3 bg-primary text-white font-semibold rounded-md hover:brightness-110 transition flex items-center justify-center gap-2"
          >
            <FaCheckCircle /> Rolle zuweisen
          </button>

          {status && <p className="text-sm text-primary mt-2">{status}</p>}
        </div>

        {/* DAO Settings (jetzt einheitlich gestylt) */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <DaoSettings
            selector={selector}
            accountId={accountId}
            contractId={contractId}
          />
        </div>
      </div>

      {/* Alle Balances */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <AllBalances contractId={contractId} />
      </div>
    </div>
  );
}