// src/pages/DashboardPage.js
import React from "react";
import { FaUserShield, FaWallet, FaListAlt } from "react-icons/fa";
import TokenInfo from "../components/TokenInfo";
import ProposalOverview from "../components/ProposalOverview.js";

const DashboardPage = ({
  accountId,
  contractId,
  metadata,
  userBalance,
  totalSupply,
  proposals,
  userRole,
}) => {
  const cardStyle =
    "flex items-center gap-4 p-6 bg-white shadow-sm rounded-xl border border-gray-200";

  return (
    <div className="px-8 py-12 bg-[#F5F7FB] text-black min-h-screen space-y-16">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className={cardStyle}>
          <FaUserShield className="text-2xl text-secondary" />
          <div>
            <p className="text-sm text-gray-500">Deine Rolle</p>
            <p className="text-lg font-semibold capitalize text-[#2c1c5b]">{userRole}</p>
          </div>
        </div>
        <div className={cardStyle}>
          <FaWallet className="text-2xl text-secondary" />
          <div>
            <p className="text-sm text-gray-500">Token Balance</p>
            <p className="text-lg font-semibold text-[#2c1c5b]">
              {(parseFloat(userBalance) / Math.pow(10, metadata?.decimals || 24)).toFixed(2)} {metadata?.symbol}
            </p>
          </div>
        </div>
        <div className={cardStyle}>
          <FaListAlt className="text-2xl text-secondary" />
          <div>
            <p className="text-sm text-gray-500">Proposals gesamt</p>
            <p className="text-lg font-semibold text-[#2c1c5b]">{proposals.length}</p>
          </div>
        </div>
      </div>

      {/* Proposal Übersicht */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-10 max-w-6xl mx-auto">
        <ProposalOverview
          proposals={proposals}
          metadata={metadata}
          totalSupply={totalSupply}
          userBalance={userBalance}
        />
      </div>

      {/* Token Infos */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-[#2c1c5b] flex items-center gap-2">📊 Token Details</h2>
        <TokenInfo accountId={accountId} contractId={contractId} showTitle={false} />
      </div>
    </div>
  );
};

export default DashboardPage;