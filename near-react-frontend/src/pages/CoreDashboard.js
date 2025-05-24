// src/pages/CoreDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AllBalances from "../components/AllBalances";
import { FaUserPlus, FaUserShield, FaCheckCircle, FaCoins, FaTrash } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL || "";

export default function CoreDashboard({ selector, accountId, contractId, userRole }) {
  const [roleToAssign, setRoleToAssign] = useState("");
  const [targetAccount, setTargetAccount] = useState("");
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  // Team-Panel State
  const [teamAccounts, setTeamAccounts] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [teamDescriptions, setTeamDescriptions] = useState({});
  const [newTeamAccount, setNewTeamAccount] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [teamStatus, setTeamStatus] = useState(null);
  const [teamStatusType, setTeamStatusType] = useState(null); // 'success' | 'error'
  const teamStatusTimeout = React.useRef(null);

  const [activeTab, setActiveTab] = useState("team");

  useEffect(() => {
    if (userRole !== "core") {
      navigate("/");
    }
  }, [userRole, navigate]);

  // Lade Team-Accounts und Beschreibungen robust (direkt via fetch)
  useEffect(() => {
    const loadTeamAccounts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/team`);
        if (!res.ok) throw new Error("Fehler beim Laden der Team-Mitglieder");
        const team = await res.json();
        setTeamAccounts(team.map(m => m.accountId));
        const descs = {};
        team.forEach(m => { descs[m.accountId] = m.description; });
        setTeamDescriptions(descs);
      } catch (e) {
        setTeamAccounts([]);
        setTeamDescriptions({});
      }
      setLoadingTeam(false);
    };
    loadTeamAccounts();
  }, []);

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

  // Team-Mitglied hinzufügen (direkt via fetch)
  const handleAddTeamMember = async () => {
    if (!newTeamAccount) {
      setTeamStatus("Bitte AccountId angeben.");
      setTeamStatusType("error");
      clearTimeout(teamStatusTimeout.current);
      teamStatusTimeout.current = setTimeout(() => setTeamStatus(null), 2000);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: newTeamAccount, description: newTeamDesc }),
      });
      if (!res.ok) throw new Error("Fehler beim Hinzufügen");
      const member = await res.json();
      setTeamAccounts((prev) => [...prev, member.accountId]);
      setTeamDescriptions((prev) => ({ ...prev, [member.accountId]: member.description }));
      setTeamStatus(`Team-Mitglied ${member.accountId} hinzugefügt.`);
      setTeamStatusType("success");
      setNewTeamAccount("");
      setNewTeamDesc("");
      clearTimeout(teamStatusTimeout.current);
      teamStatusTimeout.current = setTimeout(() => setTeamStatus(null), 2000);
    } catch (err) {
      setTeamStatus("Fehler beim Hinzufügen: " + (err?.message || err));
      setTeamStatusType("error");
      clearTimeout(teamStatusTimeout.current);
      teamStatusTimeout.current = setTimeout(() => setTeamStatus(null), 2000);
    }
  };

  // Team-Mitglied entfernen (direkt via fetch)
  const handleRemoveTeamMember = async (acc) => {
    try {
      const res = await fetch(`${API_URL}/api/team/${acc}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Fehler beim Entfernen");
      setTeamAccounts((prev) => prev.filter((a) => a !== acc));
      setTeamDescriptions((prev) => {
        const copy = { ...prev };
        delete copy[acc];
        return copy;
      });
      setTeamStatus(`Team-Mitglied ${acc} entfernt.`);
      setTeamStatusType("success");
      clearTimeout(teamStatusTimeout.current);
      teamStatusTimeout.current = setTimeout(() => setTeamStatus(null), 2000);
    } catch (err) {
      setTeamStatus("Fehler beim Entfernen: " + (err?.message || err));
      setTeamStatusType("error");
      clearTimeout(teamStatusTimeout.current);
      teamStatusTimeout.current = setTimeout(() => setTeamStatus(null), 2000);
    }
  };

  // --- Inline-Panel-Komponenten ---
  const TeamPanel = () => (
    <div className="glass-effect p-6">
      <div className="card-header">
        <h2 className="text-xl font-bold text-[#2c1c5b] flex items-center gap-2">
          <FaUserPlus className="text-[#6B46C1]" />
          Team-Mitglieder verwalten
        </h2>
      </div>
      <div className="card-content mt-4">
        {/* Hinzufügen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account ID</label>
            <input
              type="text"
              value={newTeamAccount}
              onChange={(e) => setNewTeamAccount(e.target.value)}
              placeholder="account.near"
              className="w-full px-4 py-2 glass-effect focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Beschreibung/Funktion</label>
            <input
              type="text"
              value={newTeamDesc}
              onChange={(e) => setNewTeamDesc(e.target.value)}
              placeholder="z.B. Frontend-Entwickler"
              className="w-full px-4 py-2 glass-effect focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={handleAddTeamMember}
          className="modern-button mb-4"
        >
          <FaUserPlus className="mr-2" /> Team-Mitglied hinzufügen
        </button>
        {/* Statusmeldung */}
        {teamStatus && (
          <div
            className={`flex items-center gap-3 mb-4 px-4 py-3 rounded-lg shadow-md animate-fade-in-fast
              ${teamStatusType === "success"
                ? "bg-green-100 border border-green-300 text-green-800"
                : "bg-red-100 border border-red-300 text-red-800"}
            `}
            style={{ minHeight: 48 }}
          >
            {teamStatusType === "success" ? (
              <FaCheckCircle className="text-green-500 text-xl" />
            ) : (
              <MdErrorOutline className="text-red-500 text-xl" />
            )}
            <span className="font-medium">{teamStatus}</span>
          </div>
        )}
        {/* Team-Liste */}
        {loadingTeam ? (
          <div className="text-gray-500 py-8 text-center">Lade Team-Mitglieder...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-700">
                  <th className="py-2 pr-4">Account ID</th>
                  <th className="py-2 pr-4">Beschreibung</th>
                  <th className="py-2">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {teamAccounts.map((acc) => (
                  <tr key={acc} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-mono">{acc}</td>
                    <td className="py-2 pr-4">{teamDescriptions[acc] || <span className="text-gray-400">-</span>}</td>
                    <td className="py-2">
                      <button
                        onClick={() => handleRemoveTeamMember(acc)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        title="Entfernen"
                      >
                        <FaTrash /> Entfernen
                      </button>
                    </td>
                  </tr>
                ))}
                {teamAccounts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-gray-400 text-center">Noch keine Team-Mitglieder erfasst.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const RolePanel = () => (
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
  );

  const DividendPanel = () => (
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
  );

  const BalancesPanel = () => (
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
  );

  // --- Tabs UI ---
  const tabList = [
    { key: "team", label: "Team" },
    { key: "roles", label: "Rollen" },
    { key: "dividends", label: "Dividenden" },
    { key: "balances", label: "Balances" },
  ];

  return (
    <div className="min-h-screen bg-pattern text-black px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-effect p-8 mb-8">
          <h1 className="text-3xl font-bold text-[#2c1c5b] mb-2 flex items-center gap-2">
            <FaUserShield className="text-[#6B46C1]" />
            Core Dashboard
          </h1>
          <p className="text-gray-600">
            Verwaltung und Überwachung des DAO-Systems
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-4 border-b mb-8">
          {tabList.map(tab => (
            <button
              key={tab.key}
              className={`tab px-6 py-2 text-base font-semibold focus:outline-none transition
                ${activeTab === tab.key ? "tab-active border-b-2 border-[#6B46C1] text-[#2c1c5b]" : "text-[#6B46C1] hover:text-[#2c1c5b]"}
              `}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "team" && <TeamPanel />}
          {activeTab === "roles" && <RolePanel />}
          {activeTab === "dividends" && <DividendPanel />}
          {activeTab === "balances" && <BalancesPanel />}
        </div>
      </div>
    </div>
  );
}