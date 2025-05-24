// src/pages/ProposalDetailPage.js
import React, { useEffect, useState, useRef } from "react";
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
import { MdErrorOutline } from "react-icons/md";

export default function ProposalDetailPage({ contractId, accountId, selector, userRole }) {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voteStatus, setVoteStatus] = useState(null);
  const [executeStatus, setExecuteStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const successTimeout = useRef(null);

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

  const handleExecute = async () => {
    try {
      const wallet = await selector.wallet();
      await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: contractId,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "execute_proposal",
              args: { proposal_id: proposal.id },
              gas: "30000000000000",
              deposit: "0",
            },
          },
        ],
      });
      setShowSuccess(true);
      setShowError(false);
      setExecuteStatus("✅ Auszahlung erfolgreich ausgeführt.");
      successTimeout.current = setTimeout(() => {
        setShowSuccess(false);
        setShowModal(false);
      }, 1500);
    } catch (error) {
      console.error("Fehler bei der Auszahlung:", error);
      setShowError(true);
      setErrorMsg(error?.message || "Unbekannter Fehler bei der Auszahlung.");
      setExecuteStatus("❌ Fehler bei der Auszahlung.");
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeout.current) clearTimeout(successTimeout.current);
    };
  }, []);

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
        <div className="glass-effect proposal-hover p-6">
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
                  <span>{maskAccountId(accountId)} ({ (parseFloat(weight) / 1e24).toFixed(2) } THESISDAO)</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="glass-effect proposal-hover p-6">
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
                  <span>{maskAccountId(accountId)} ({ (parseFloat(weight) / 1e24).toFixed(2) } THESISDAO)</span>
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
          <InfoCard icon={<FaMoneyBillWave />} label="Betrag" value={`${formatYocto(proposal.amount)} THESISDAO`} desc="Beantragte Summe." />
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
          <InfoCard icon={<FaBalanceScale />} label="Quorum" value={`${formatYocto(proposal.quorum)} THESISDAO`} desc="Benötigte Gesamtstimmen." />
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

      {/* Auszahlung-Button für Core/Finance bei angenommenen, nicht ausgeführten Proposals */}
      {proposal.status === "Accepted" && !proposal.executed && (userRole === "core" || userRole === "finance") && (
        <div className="flex flex-wrap gap-4 pt-10">
          <ActionButton onClick={() => setShowModal(true)} color="violet" icon={<FaMoneyBillWave />}>
            Auszahlung aus Treasury ausführen
          </ActionButton>
        </div>
      )}

      {/* Bestätigungs-Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-0 max-w-lg w-full relative border border-gray-200">
            {/* Header mit Icon und Close-Button */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#6B46C1] to-[#4F3BA9] rounded-t-2xl px-6 py-4">
              <div className="flex items-center gap-3">
                <FaMoneyBillWave className="text-white text-2xl" />
                <h2 className="text-lg font-bold text-white">Auszahlung bestätigen</h2>
              </div>
              <button
                className="text-white text-xl hover:text-gray-200 focus:outline-none"
                onClick={() => { setShowModal(false); setShowError(false); setShowSuccess(false); }}
                aria-label="Schließen"
              >
                &times;
              </button>
            </div>
            {/* Modal Body */}
            <div className="px-6 py-6 min-h-[180px] flex flex-col justify-center items-center">
              {showSuccess ? (
                <div className="flex flex-col items-center justify-center w-full animate-fade-in">
                  <div className="bg-green-100 rounded-full p-4 mb-4 animate-success-pop">
                    <FaCheckCircle className="text-green-600 text-5xl" />
                  </div>
                  <div className="text-green-700 font-bold text-lg mb-2">Auszahlung erfolgreich!</div>
                  <div className="text-gray-500 text-sm">Die Tokens wurden an die Zieladresse überwiesen.</div>
                </div>
              ) : showError ? (
                <div className="flex flex-col items-center justify-center w-full animate-fade-in">
                  <div className="bg-red-100 rounded-full p-4 mb-4 animate-success-pop">
                    <MdErrorOutline className="text-red-600 text-5xl" />
                  </div>
                  <div className="text-red-700 font-bold text-lg mb-2">Fehler bei der Auszahlung</div>
                  <div className="text-gray-500 text-sm break-words max-w-xs text-center">{errorMsg}</div>
                </div>
              ) : (
                <>
                  <p className="mb-2 text-gray-700">Du bist dabei, folgende Auszahlung aus dem <span className="font-semibold text-[#6B46C1]">Community Treasury</span> auszuführen:</p>
                  <div className="mb-4 bg-gray-50 rounded-lg p-4 flex flex-col gap-2 border border-gray-100 w-full">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Betrag:</span>
                      <span className="text-[#2c1c5b] font-bold text-lg">{formatYocto(proposal.amount)} THESISDAO</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Zieladresse:</span>
                      <span className="text-gray-900 font-mono break-all w-full">{proposal.target_account}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                    <FaCheckCircle className="text-[#6B46C1]" />
                    Bitte prüfe die Angaben sorgfältig. Diese Aktion kann nicht rückgängig gemacht werden.
                  </p>
                  <div className="flex gap-4 mt-6">
                    <button
                      className="modern-button bg-gradient-to-r from-[#6B46C1] to-[#4F3BA9] text-white rounded-full px-6 py-2 shadow-md hover:scale-105 transition"
                      onClick={handleExecute}
                    >
                      Auszahlung bestätigen
                    </button>
                    <button
                      className="modern-button bg-gray-200 text-gray-700 rounded-full px-6 py-2 hover:bg-gray-300 transition"
                      onClick={() => { setShowModal(false); setShowError(false); setShowSuccess(false); }}
                    >
                      Abbrechen
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {voteStatus && <p className="text-sm mt-6 text-[#6B46C1] font-medium">{voteStatus}</p>}
      {executeStatus && <p className="text-sm mt-6 text-[#6B46C1] font-medium">{executeStatus}</p>}
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