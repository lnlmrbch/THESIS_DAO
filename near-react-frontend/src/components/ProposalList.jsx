// src/components/ProposalList.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProposalList({ selector, contractId, accountId, metadata, userBalance, totalSupply, proposals }) {
  const navigate = useNavigate();

  const formatYocto = (amount) => {
    if (!amount || isNaN(amount)) return "0.00";
    return (parseFloat(amount) / 1e24).toFixed(2);
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#2c1c5b]">🗳 Alle Proposals</h2>
          <p className="text-sm text-gray-500">
            Dein Stimmrecht:{" "}
            <span className="text-primary font-semibold">
              {formatYocto(userBalance)} / {formatYocto(totalSupply)} {metadata?.symbol || "TOKEN"}
            </span>
          </p>
        </div>
        <button
          onClick={() => navigate("/proposals/new")}
          className="px-4 py-2 bg-primary text-white font-medium rounded-md hover:brightness-110"
        >
          ➕ Neuer Proposal
        </button>
      </div>

      {(!proposals || proposals.length === 0) ? (
        <p className="text-center text-gray-500">Noch keine Proposals vorhanden.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {proposals.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/proposals/${p.id}`)}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  #{p.id} · <span className="text-primary font-medium">{p.title}</span>
                </h4>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium tracking-wide ${
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
              <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}