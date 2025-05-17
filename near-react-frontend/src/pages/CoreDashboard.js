// src/pages/CoreDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AllBalances from "../components/AllBalances";
import DaoSettings from "../components/DaoSettings";
import { FaUserPlus, FaUserShield, FaCheckCircle, FaCoins } from "react-icons/fa";

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
    <div className="min-h-screen bg-pattern text-black px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="glass-effect p-8">
          <h1 className="text-3xl font-bold text-[#2c1c5b] mb-2 flex items-center gap-2">
            <FaUserShield className="text-[#6B46C1]" />
            Core Dashboard
          </h1>
          <p className="text-gray-600">
            Verwaltung und Überwachung des DAO-Systems
          </p>
        </div>

        {/* Role Management */}
        <div className="glass-effect p-6">
          <div className="card-header">
            <h2 className="text-xl font-bold text-[#2c1c5b] flex items-center gap-2">
              <FaUserPlus className="text-[#6B46C1]" />
              Rollen verwalten
            </h2>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account ID
                </label>
                <input
                  type="text"
                  value={targetAccount}
                  onChange={(e) => setTargetAccount(e.target.value)}
                  placeholder="account.near"
                  className="w-full px-4 py-2 glass-effect focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rolle
                </label>
                <select
                  value={roleToAssign}
                  onChange={(e) => setRoleToAssign(e.target.value)}
                  className="w-full px-4 py-2 glass-effect focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent"
                >
                  <option value="">Rolle auswählen</option>
                  <option value="core">Core</option>
                  <option value="community">Community</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
            </div>
            <button
              onClick={assignRole}
              className="modern-button mt-4"
            >
              Rolle zuweisen
            </button>

            {status && (
              <div className="glass-effect p-4 mt-4 bg-opacity-50">
                <p className="text-sm text-[#6B46C1]">{status}</p>
              </div>
            )}
          </div>
        </div>

        {/* DAO Settings */}
        <div className="glass-effect p-6">
          <div className="card-header">
            <h2 className="text-xl font-bold text-[#2c1c5b] flex items-center gap-2">
              <FaCheckCircle className="text-[#6B46C1]" />
              DAO Einstellungen
            </h2>
          </div>
          <div className="mt-4">
            <DaoSettings
              selector={selector}
              accountId={accountId}
              contractId={contractId}
            />
          </div>
        </div>

        {/* Dividend Distribution */}
        <div className="glass-effect p-6">
          <div className="card-header">
            <h2 className="text-xl font-bold text-[#2c1c5b] flex items-center gap-2">
              <FaCoins className="text-[#6B46C1]" />
              Gewinne verteilen
            </h2>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-4">
              Verteile monatliche Gewinne an alle Tokenholder basierend auf deren Anteil.
            </p>
            <button
              onClick={() => navigate("/distribute-dividends")}
              className="modern-button"
            >
              Zur Auszahlungsübersicht
            </button>
          </div>
        </div>

        {/* All Balances */}
        <div className="glass-effect p-6">
          <div className="card-header">
            <h2 className="text-xl font-bold text-[#2c1c5b] flex items-center gap-2">
              <FaCoins className="text-[#6B46C1]" />
              Alle Balances
            </h2>
          </div>
          <div className="mt-4">
            <AllBalances contractId={contractId} />
          </div>
        </div>
      </div>
    </div>
  );
}