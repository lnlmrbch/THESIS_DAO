import React, { useEffect, useState } from "react";
import { initWalletSelector } from "./wallet";
import WalletSelectorModal from "./ui/WalletSelectorModal";
import TokenInfo from "./components/TokenInfo";
import TokenTransferForm from "./components/TransferForm";
import ProposalList from "./components/ProposalList";
import CreateProposalForm from "./components/CreateProposalForm";

function App() {
  const [selector, setSelector] = useState(null);
  const [modal, setModal] = useState(null);
  const [accountId, setAccountId] = useState(null);

  const contractId = "lionelsmartcontract.testnet";

  useEffect(() => {
    (async () => {
      const { selector, modal } = await initWalletSelector();
      setSelector(selector);
      setModal(modal);

      try {
        const wallet = await selector.wallet();

        if (!wallet) {
          console.warn("No wallet selected");
          modal.show();
          return;
        }

        const accounts = await wallet.getAccounts();
        if (accounts.length > 0) {
          setAccountId(accounts[0].accountId);
        }
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
    <div style={{ padding: 32 }}>
      <h1>🚀 NEAR Wallet Selector UI</h1>

      {!accountId ? (
        modal && <WalletSelectorModal modal={modal} />
      ) : (
        <>
          <p>✅ Verbunden mit: <strong>{accountId}</strong></p>
          <button onClick={signOut}>Logout</button>

          <TokenInfo
            selector={selector}
            accountId={accountId}
            contractId={contractId}
          />

          <ProposalList selector={selector} contractId={contractId} accountId={accountId} />
          <CreateProposalForm selector={selector} contractId={contractId} />
          
          <TokenTransferForm
            selector={selector}
            accountId={accountId}
            contractId={contractId}
          />
        </>
      )}
    </div>
  );
}

export default App;
