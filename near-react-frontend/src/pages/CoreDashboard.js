import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TokenInfo from "../components/TokenInfo";
import AllBalances from "../components/AllBalances";

export default function CoreDashboard({ selector, accountId, contractId, userRole }) {
  const [roleToAssign, setRoleToAssign] = useState("");
  const [targetAccount, setTargetAccount] = useState("");
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== "core") {
      navigate("/"); // Redirect non-core users
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
    <div className="min-h-screen bg-darkbg text-white px-6 py-12 max-w-4xl mx-auto space-y-10">
      <h1 className="text-4xl font-bold text-accent">⚙️ Core Member Dashboard</h1>

      <section className="bg-cardbg p-6 rounded-xl border border-gray-700 shadow-md space-y-6">
        <h2 className="text-2xl font-semibold">👤 Rolle zuweisen</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Ziel-Account ID"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md"
            value={targetAccount}
            onChange={(e) => setTargetAccount(e.target.value)}
          />
          <select
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md"
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
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-accent text-black font-bold rounded-full hover:brightness-110"
          >
            Rolle zuweisen
          </button>
          {status && <p className="text-sm text-accent">{status}</p>}
        </div>
      </section>

      <TokenInfo accountId={accountId} contractId={contractId} />
      <AllBalances selector={selector} contractId={contractId} />
    </div>
  );
}