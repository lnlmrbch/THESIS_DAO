// src/pages/CoreDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AllBalances from "../components/AllBalances";
import DaoSettings from "../components/DaoSettings";

export default function CoreDashboard({
  selector,
  accountId,
  contractId,
  userRole,
}) {
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
    <div className="min-h-screen bg-[#F5F7FB] text-black px-6 py-12 m-full">
      <h1 className="text-3xl font-bold text-[#2c1c5b] mb-4">⚙️ Core Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rolle zuweisen */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-xl font-semibold text-[#2c1c5b]">👤 Rolle zuweisen</h2>
          <input
            type="text"
            placeholder="Ziel-Account ID"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
            value={targetAccount}
            onChange={(e) => setTargetAccount(e.target.value)}
          />
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
          <button
            onClick={assignRole}
            className="w-full py-3 bg-primary text-white font-semibold rounded-md hover:brightness-110 transition"
          >
            Rolle zuweisen
          </button>
          {status && <p className="text-sm text-primary">{status}</p>}
        </div>

        {/* DAO Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <DaoSettings
            selector={selector}
            accountId={accountId}
            contractId={contractId}
          />
        </div>

        {/* Alle Balances */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <AllBalances selector={selector} contractId={contractId} />
        </div>
      </div>
    </div>
  );
}