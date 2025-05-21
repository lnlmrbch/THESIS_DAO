import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaVoteYea, 
  FaPlus, 
  FaFilter, 
  FaSearch, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaChartBar,
  FaSortAmountDown,
  FaSortAmountUp
} from "react-icons/fa";

export default function ProposalsPage({
  selector,
  contractId,
  accountId,
  metadata,
  userBalance,
  totalSupply,
  proposals,
  tokenPool,
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filteredProposals, setFilteredProposals] = useState(proposals);

  useEffect(() => {
    let filtered = [...proposals];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === "newest") {
        return b.id - a.id;
      } else if (sortOrder === "oldest") {
        return a.id - b.id;
      }
      return 0;
    });
    
    setFilteredProposals(filtered);
  }, [proposals, searchTerm, statusFilter, sortOrder]);

  const formatYocto = (amount) => {
    if (!amount || isNaN(amount)) return "0.00";
    return (parseFloat(amount) / 1e24).toFixed(2);
  };

  const getVotingPower = () => {
    const circulatingSupply = parseFloat(totalSupply) - parseFloat(tokenPool);
    if (circulatingSupply <= 0) return "0.00000";
    return ((parseFloat(userBalance) / circulatingSupply) * 100).toFixed(5);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Active":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <FaCheckCircle className="mr-1" />;
      case "Rejected":
        return <FaTimesCircle className="mr-1" />;
      case "Active":
        return <FaClock className="mr-1" />;
      default:
        return <FaClock className="mr-1" />;
    }
  };

  const vote = async (proposal_id, support) => {
    const wallet = await selector.wallet();
    await wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "vote_on_proposal",
            args: { proposal_id, support },
            gas: "30000000000000",
            deposit: "1",
          },
        },
      ],
    });
  };

  const finalize = async (proposal_id) => {
    const wallet = await selector.wallet();
    await wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "finalize_proposal",
            args: { proposal_id },
            gas: "30000000000000",
            deposit: "0",
          },
        },
      ],
    });
  };

  console.log("userBalance:", userBalance, "totalSupply:", totalSupply);

  return (
    <div className="min-h-screen bg-pattern text-black px-6 py-12">
      {/* Header Section */}
      <div className="glass-effect p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#2c1c5b] flex items-center gap-2">
              <FaVoteYea className="text-[#6B46C1]" />
              Proposals
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Dein Stimmrecht:{" "}
              <span className="text-[#6B46C1] font-semibold">
                {formatYocto(userBalance)} {metadata?.symbol || "TOKEN"} ({getVotingPower()}%)
              </span>
            </p>
          </div>
          <button
            onClick={() => navigate("/proposals/new")}
            className="modern-button"
          >
            <FaPlus /> Neuer Proposal
          </button>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Suche nach Proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-effect focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-effect focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent appearance-none"
            >
              <option value="all">Alle Status</option>
              <option value="Active">Aktiv</option>
              <option value="Accepted">Angenommen</option>
              <option value="Rejected">Abgelehnt</option>
            </select>
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
          </div>

          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-effect focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent appearance-none"
            >
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
            </select>
            <FaSortAmountDown className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Proposals List */}
      {filteredProposals.length === 0 ? (
        <div className="glass-effect p-8 text-center">
          <p className="text-gray-500 text-lg">Keine Proposals gefunden.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredProposals.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/proposals/${p.id}`)}
              className="glass-effect p-6 hover:scale-[1.02] cursor-pointer transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-[#6B46C1] transition-colors">
                    #{p.id} · {p.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Erstellt von {p.proposer}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium tracking-wide flex items-center ${getStatusColor(p.status)}`}
                >
                  {getStatusIcon(p.status)}
                  {p.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{p.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center">
                    <FaChartBar className="mr-1" />
                    {p.votes_for + p.votes_against} Stimmen
                  </span>
                  <span>
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-[#6B46C1] font-medium group-hover:underline">
                  Details anzeigen →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}