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

  if (loading) return <div className="p-6">⏳ Lade Proposal...</div>;
  if (!proposal) return <div className="p-6 text-red-500">❌ Proposal nicht gefunden.</div>;

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-black px-6 py-12 m-full">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-[#2c1c5b]">{proposal.title}</h1>
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <FaUser className="text-gray-400" /> Eingereicht von <strong>{proposal.proposer}</strong>
        </p>
        <p className="text-lg text-gray-700">{proposal.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {proposal.link && (
          <div>
            <p className="font-semibold flex items-center gap-2">
              <FaLink /> Link
            </p>
            <a href={proposal.link} className="text-primary underline" target="_blank" rel="noreferrer">
              {proposal.link}
            </a>
            <p className="text-gray-500 text-sm">Verweis auf Dokumente oder weiterführende Informationen.</p>
          </div>
        )}
        {proposal.amount && (
          <div>
            <p className="font-semibold flex items-center gap-2">
              <FaMoneyBillWave /> Betrag
            </p>
            <p>{formatYocto(proposal.amount)} TOKEN</p>
            <p className="text-gray-500 text-sm">Beantragte Summe bei erfolgreicher Annahme.</p>
          </div>
        )}
        {proposal.target_account && (
          <div>
            <p className="font-semibold flex items-center gap-2">
              <FaUser /> Zielkonto
            </p>
            <p>{proposal.target_account}</p>
            <p className="text-gray-500 text-sm">Konto, an welches der Betrag ausgezahlt wird.</p>
          </div>
        )}
        {proposal.category && (
          <div>
            <p className="font-semibold flex items-center gap-2">
              <FaFolderOpen /> Kategorie
            </p>
            <p>{proposal.category}</p>
            <p className="text-gray-500 text-sm">Art des Vorhabens wie Tooling, Events usw.</p>
          </div>
        )}
        {proposal.deadline && (
          <div>
            <p className="font-semibold flex items-center gap-2">
              <FaCalendarAlt /> Deadline
            </p>
            <p>{new Date(proposal.deadline * 1000).toLocaleDateString()}</p>
            <p className="text-gray-500 text-sm">
              {calculateDaysRemaining(proposal.deadline)}
            </p>
          </div>
        )}
        {proposal.required_role && (
          <div>
            <p className="font-semibold flex items-center gap-2">
              <FaUser /> Erforderliche Rolle
            </p>
            <p>{proposal.required_role}</p>
            <p className="text-gray-500 text-sm">Nur diese Rolle darf abstimmen.</p>
          </div>
        )}
        {proposal.quorum && (
          <div>
            <p className="font-semibold flex items-center gap-2">
              <FaBalanceScale /> Quorum
            </p>
            <p>{formatYocto(proposal.quorum)} TOKEN</p>
            <p className="text-gray-500 text-sm">Minimale Token-Menge, die insgesamt abstimmen muss.</p>
          </div>
        )}
      </div>

      {proposal.status === "Open" && (
        <div className="flex flex-wrap gap-4 pt-6">
          <button
            onClick={() => vote(true)}
            className="px-5 py-3 bg-green-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-green-700"
          >
            <FaThumbsUp /> Zustimmung
          </button>
          <button
            onClick={() => vote(false)}
            className="px-5 py-3 bg-red-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-red-700"
          >
            <FaThumbsDown /> Ablehnung
          </button>
          {userRole === "core" && (
            <button
              onClick={finalize}
              className="px-5 py-3 bg-gray-300 text-black rounded-lg font-medium flex items-center gap-2 hover:bg-gray-400"
            >
              <FaCheckCircle /> Vorzeitig finalisieren
            </button>
          )}
        </div>
      )}

      {voteStatus && <p className="text-sm mt-4 text-primary">{voteStatus}</p>}
    </div>
  );
}