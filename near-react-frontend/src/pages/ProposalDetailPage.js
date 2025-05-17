// src/pages/ProposalDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { providers } from "near-api-js";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaCheckCircle,
  FaUser,
  FaLink,
  FaMoneyBillWave,
  FaFolderOpen,
  FaCalendarAlt,
  FaBalanceScale,
  FaUserShield,
  FaUserCircle,
} from "react-icons/fa";

export default function ProposalDetailPage({ contractId, accountId, selector, userRole }) {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voteStatus, setVoteStatus] = useState(null);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const provider = new providers.JsonRpcProvider("https://rpc.testnet.near.org");
        const res = await provider.query({
          request_type: "call_function",
          account_id: contractId,
          method_name: "get_proposal_by_id",
          args_base64: btoa(JSON.stringify({ proposal_id: parseInt(id) })),
          finality: "optimistic",
        });
        const proposalData = JSON.parse(new TextDecoder().decode(new Uint8Array(res.result)));
        setProposal(proposalData);
      } catch (error) {
        console.error("Fehler beim Laden des Proposals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id, contractId]);

  const vote = async (support) => {
    try {
      const wallet = await selector.wallet();
      await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: contractId,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "vote_on_proposal",
              args: { proposal_id: parseInt(id), support },
              gas: "30000000000000",
              deposit: "1",
            },
          },
        ],
      });

      setVoteStatus("✅ Stimme erfolgreich abgegeben.");
    } catch (error) {
      console.error("Fehler beim Abstimmen:", error);
      setVoteStatus("❌ Fehler beim Abstimmen.");
    }
  };

  const finalize = async () => {
    try {
      const wallet = await selector.wallet();
      await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: contractId,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "finalize_proposal",
              args: { proposal_id: parseInt(id) },
              gas: "30000000000000",
              deposit: "0",
            },
          },
        ],
      });

      setVoteStatus("✅ Proposal erfolgreich finalisiert.");
    } catch (error) {
      console.error("Fehler beim Finalisieren:", error);
      setVoteStatus("❌ Fehler beim Finalisieren.");
    }
  };

  const formatYocto = (amount) =>
    !amount || isNaN(amount) ? "0.00" : (parseFloat(amount) / 1e24).toFixed(2);

  const calculateDaysRemaining = (deadline) => {
    const now = Math.floor(Date.now() / 1000);
    const secondsLeft = deadline - now;
    const daysLeft = Math.ceil(secondsLeft / (60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} Tage verbleibend` : "Abgelaufen";
  };

  const maskAccountId = (id) => {
    if (!id) return "";
    const parts = id.split(".");
    if (parts.length > 1) {
      const name = parts[0];
      const domain = parts.slice(1).join(".");
      if (name.length > 4) {
        return name.slice(0, 2) + "****" + name.slice(-1) + "." + domain;
      } else {
        return id; // Keine Maskierung, wenn der Name zu kurz ist
      }
    } else {
      return id; // Keine Maskierung, wenn kein Punkt vorhanden ist (ungültige NEAR-ID)
    }
  };

  if (loading) return <div className="p-6">⏳ Lade Proposal...</div>;
  if (!proposal) return <div className="p-6 text-red-500">❌ Proposal nicht gefunden.</div>;

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-black px-6 py-12">
      <div className="space-y-3 mb-10">
        <h1 className="text-4xl font-bold text-[#2c1c5b]">{proposal.title}</h1>
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <FaUser className="text-[#6B46C1]" />
          Eingereicht von <span className="font-medium text-black">{maskAccountId(proposal.proposer)}</span>
        </p>
        <p className="text-lg text-gray-700">{proposal.description}</p>
      </div>

      {/* Vote Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="glass-effect p-6">
          <h3 className="text-lg font-semibold text-[#2c1c5b] mb-4 flex items-center gap-2">
            <FaThumbsUp className="text-green-600"/> Zustimmungen ({proposal.votes_for.length})
          </h3>
          <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {proposal.votes_for.length === 0 ? (
              <li className="text-gray-500 text-sm">Noch keine Zustimmungen</li>
            ) : (
              proposal.votes_for.map(([accountId, weight], index) => (
                <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                  <FaUserCircle className="text-[#6B46C1] flex-shrink-0"/>
                  <span>{maskAccountId(accountId)} ({ (parseFloat(weight) / 1e24).toFixed(2) } LIONEL)</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="glass-effect p-6">
          <h3 className="text-lg font-semibold text-[#2c1c5b] mb-4 flex items-center gap-2">
            <FaThumbsDown className="text-red-600"/> Ablehnungen ({proposal.votes_against.length})
          </h3>
          <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {proposal.votes_against.length === 0 ? (
              <li className="text-gray-500 text-sm">Noch keine Ablehnungen</li>
            ) : (
              proposal.votes_against.map(([accountId, weight], index) => (
                <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                  <FaUserCircle className="text-[#6B46C1] flex-shrink-0"/>
                  <span>{maskAccountId(accountId)} ({ (parseFloat(weight) / 1e24).toFixed(2) } LIONEL)</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {proposal.link && (
          <InfoCard icon={<FaLink />} label="Link" value={proposal.link} desc="Verweis auf weiterführende Inhalte." isLink />
        )}
        {proposal.amount && (
          <InfoCard icon={<FaMoneyBillWave />} label="Betrag" value={`${formatYocto(proposal.amount)} LIONEL`} desc="Beantragte Summe." />
        )}
        {proposal.target_account && (
          <InfoCard icon={<FaUser />} label="Zielkonto" value={proposal.target_account} desc="Empfänger bei Auszahlung." />
        )}
        {proposal.category && (
          <InfoCard icon={<FaFolderOpen />} label="Kategorie" value={proposal.category} desc="Zugeordneter Bereich." />
        )}
        {proposal.deadline && (
          <InfoCard
            icon={<FaCalendarAlt />}
            label="Deadline"
            value={new Date(proposal.deadline * 1000).toLocaleDateString()}
            desc={calculateDaysRemaining(proposal.deadline)}
          />
        )}
        {proposal.required_role && (
          <InfoCard icon={<FaUserShield />} label="Erforderliche Rolle" value={proposal.required_role} desc="Nur diese Rolle darf abstimmen." />
        )}
        {proposal.quorum && (
          <InfoCard icon={<FaBalanceScale />} label="Quorum" value={`${formatYocto(proposal.quorum)} LIONEL`} desc="Benötigte Gesamtstimmen." />
        )}
      </div>

      {proposal.status === "Open" && (
        <div className="flex flex-wrap gap-4 pt-10">
          <ActionButton onClick={() => vote(true)} color="green" icon={<FaThumbsUp />}>
            Zustimmung
          </ActionButton>
          <ActionButton onClick={() => vote(false)} color="red" icon={<FaThumbsDown />}>
            Ablehnung
          </ActionButton>
          {userRole === "core" && (
            <ActionButton onClick={finalize} color="violet" icon={<FaCheckCircle />}>
              Vorzeitig finalisieren
            </ActionButton>
          )}
        </div>
      )}

      {voteStatus && <p className="text-sm mt-6 text-[#6B46C1] font-medium">{voteStatus}</p>}
    </div>
  );
}

const InfoCard = ({ icon, label, value, desc, isLink }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition">
    <p className="text-sm font-semibold text-gray-600 flex items-center gap-2">
      <span className="text-[#6B46C1]">{icon}</span> {label}
    </p>
    <p className="text-black font-medium text-sm break-words mt-1">
      {isLink ? (
        <a href={value} target="_blank" rel="noreferrer" className="underline text-[#6B46C1]">
          {value}
        </a>
      ) : (
        value
      )}
    </p>
    <p className="text-xs text-gray-500 mt-1">{desc}</p>
  </div>
);

const ActionButton = ({ onClick, color, icon, children }) => {
  const colorMap = {
    green: "bg-green-600",
    red: "bg-red-600",
    violet: "bg-[#6B46C1]",
  };
  return (
    <button 
      onClick={onClick} 
      className={`modern-button ${colorMap[color]} hover:brightness-110`}
    >
      {icon} {children}
    </button>
  );
};