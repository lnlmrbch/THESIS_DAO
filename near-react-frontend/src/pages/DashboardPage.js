// src/pages/DashboardPage.js
import React from "react";
import {
  FaUserShield,
  FaWallet,
  FaExchangeAlt,
  FaPlus,
  FaListAlt,
} from "react-icons/fa";
import TokenInfo from "../components/TokenInfo";
import CreateProposalForm from "../components/CreateProposalForm";
import TokenTransferForm from "../components/TransferForm";
import ProposalList from "../components/ProposalList";
import AllBalances from "../components/AllBalances";

const DashboardPage = ({
  selector,
  accountId,
  contractId,
  metadata,
  userBalance,
  totalSupply,
  proposals,
  userRole,
}) => {
  const cardBase =
    "flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-xl shadow hover:shadow-lg transition";

  return (
    <div className="px-8 py-12 space-y-16 bg-[#F5F7FB] text-black min-h-screen">
      {/* Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className={cardBase}>
          <FaUserShield className="text-3xl text-[#673AB7]" />
          <div>
            <p className="text-sm text-gray-600">Deine Rolle</p>
            <p className="font-semibold text-[#2c1c5b] capitalize">{userRole}</p>
          </div>
        </div>
        <div className={cardBase}>
          <FaWallet className="text-3xl text-[#673AB7]" />
          <div>
            <p className="text-sm text-gray-600">Token Balance</p>
            <p className="font-semibold text-[#2c1c5b]">
              {(parseFloat(userBalance) / Math.pow(10, metadata?.decimals || 24)).toFixed(2)}{" "}
              {metadata?.symbol}
            </p>
          </div>
        </div>
        <div className={cardBase}>
          <FaListAlt className="text-3xl text-[#673AB7]" />
          <div>
            <p className="text-sm text-gray-600">Proposals gesamt</p>
            <p className="font-semibold text-[#2c1c5b]">{proposals.length}</p>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          <div className={cardBase + " flex-col items-start"}>
            <div className="flex items-center gap-3 text-[#2c1c5b] mb-2">
              <FaExchangeAlt />
              <h2 className="text-lg font-bold">Token übertragen</h2>
            </div>
            <TokenTransferForm
              selector={selector}
              accountId={accountId}
              contractId={contractId}
            />
          </div>

          <div className={cardBase + " flex-col items-start"}>
            <div className="flex items-center gap-3 text-[#2c1c5b] mb-2">
              <FaPlus />
              <h2 className="text-lg font-bold">Proposal erstellen</h2>
            </div>
            <CreateProposalForm selector={selector} contractId={contractId} />
          </div>
        </div>

        <div>
          <ProposalList
            selector={selector}
            contractId={contractId}
            accountId={accountId}
            metadata={metadata}
            userBalance={userBalance}
            totalSupply={totalSupply}
            proposals={proposals}
          />
        </div>
      </div>

      {/* Full Token Info + All Balances */}
      <div className="space-y-16">
        <TokenInfo accountId={accountId} contractId={contractId} />
        <AllBalances selector={selector} contractId={contractId} />
      </div>
    </div>
  );
};

export default DashboardPage;