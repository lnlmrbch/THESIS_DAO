import React, { useEffect, useState } from "react";
import { initWalletSelector } from "./wallet";
import WalletSelectorModal from "./ui/WalletSelectorModal";
import TokenInfo from "./components/TokenInfo";
import TokenTransferForm from "./components/TransferForm";
import ProposalList from "./components/ProposalList";
import CreateProposalForm from "./components/CreateProposalForm";
import Navbar from "./components/Navbar";
import AllBalances from "./components/AllBalances";

function App() {
  const [selector, setSelector] = useState(null);
  const [modal, setModal] = useState(null);
  const [accountId, setAccountId] = useState(null);

  const contractId = "dao.lioneluser.testnet";

  useEffect(() => {
    (async () => {
      const { selector, modal } = await initWalletSelector();
      setSelector(selector);
      setModal(modal);

      try {
        const wallet = await selector.wallet();
        if (!wallet) {
          modal.show();
          return;
        }
        const accounts = await wallet.getAccounts();
        if (accounts.length > 0) setAccountId(accounts[0].accountId);
      } catch (err) {
        console.error("Wallet init error:", err);
        modal.show();
      }
    })();
  }, []);

  const signOut = async () => {
    const wallet = await selector.wallet();
    await wallet.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-darkbg text-gray-100 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {!accountId ? (
          modal && <WalletSelectorModal modal={modal} />
        ) : (
          <>
            <div className="flex justify-between items-center bg-cardbg p-6 rounded-lg shadow-md border border-gray-700">
              <p>✅ Verbunden mit: <strong>{accountId}</strong></p>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
              >
                Logout
              </button>
            </div>

            <Navbar accountId={accountId} />
            <TokenInfo selector={selector} accountId={accountId} contractId={contractId} />
            <TokenTransferForm selector={selector} accountId={accountId} contractId={contractId} />
            <CreateProposalForm selector={selector} contractId={contractId} />
            <ProposalList selector={selector} contractId={contractId} accountId={accountId} />
            <AllBalances selector={selector} contractId={contractId} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
