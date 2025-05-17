// src/components/ProposalOverview.js
import React from "react";
import { FaVoteYea, FaThumbsDown, FaPoll } from "react-icons/fa";

const ProposalOverview = ({ proposals, metadata, userBalance, totalSupply }) => {
  const formatYocto = (amount) => {
    if (!amount || isNaN(amount)) return "0.00";
    return (parseFloat(amount) / 1e24).toFixed(2);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-[#2c1c5b] flex items-center gap-2">
          <FaPoll className="text-[#6B46C1]" />
          Proposals Übersicht
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Deine Stimmrechte:{" "}
          <span className="text-primary font-medium">
            {formatYocto(userBalance)} / {formatYocto(totalSupply)} {metadata?.symbol || "TOKEN"}
          </span>
        </p>
      </div>

      {proposals.length === 0 ? (
        <p className="text-gray-500 text-center">Noch keine Proposals vorhanden.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {proposals.map((p) => (
            <div
              key={p.id}
              className="border border-gray-200 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-[#2c1c5b]">
                  #{p.id} · {p.description}
                </h4>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold tracking-wide ${
                    p.status === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : p.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 flex gap-4">
                <span className="flex items-center gap-1">
                  <FaVoteYea className="text-[#6B46C1]" /> {p.votes_for?.length || 0} Ja
                </span>
                <span className="flex items-center gap-1">
                  <FaThumbsDown className="text-red-500" /> {p.votes_against?.length || 0} Nein
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProposalOverview;