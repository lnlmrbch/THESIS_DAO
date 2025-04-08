import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { initWalletSelector } from "./wallet";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import CoreDashboard from "./pages/CoreDashboard";
import BuyTokensPage from "./pages/BuyTokensPage";
import TokenPurchaseSuccess from "./pages/TokenPurchaseSuccess";
import { providers } from "near-api-js";

function App() {
  const [selector, setSelector] = useState(null);
  const [modal, setModal] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [wallet, setWallet] = useState(null);

  const location = useLocation();
  const contractId = "dao.lioneluser.testnet";

  const fetchContractData = async () => {
    const provider = new providers.JsonRpcProvider("https://rpc.testnet.near.org");

    const fetchView = async (method, args = {}) => {
      const res = await provider.query({
        request_type: "call_function",
        account_id: contractId,
        method_name: method,
        args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
        finality: "optimistic",
      });
      return JSON.parse(new TextDecoder().decode(new Uint8Array(res.result)));
    };

    if (accountId) {
      const [meta, balance, supply, props, role] = await Promise.all([
        fetchView("ft_metadata"),
        fetchView("ft_balance_of", { account_id: accountId }),
        fetchView("ft_total_supply"),
        fetchView("get_proposals"),
        fetchView("get_role", { account_id: accountId }),
      ]);

      setMetadata(meta);
      setUserBalance(balance);
      setTotalSupply(supply);
      setProposals(props);
      setUserRole(role);
    }
  };

  const handleLogout = async () => {
    const wallet = await selector.wallet();
    if (wallet) {
      await wallet.signOut();
      setAccountId(null);
      setUserRole(null);
    }
  };

  useEffect(() => {
    (async () => {
      const { selector, modal } = await initWalletSelector();
      setSelector(selector);
      setModal(modal);

      try {
        const state = selector.store.getState();
        const accounts = state.accounts;
        if (accounts.length === 0) return;

        const wallet = await selector.wallet();
        setWallet(wallet);
        setAccountId(accounts[0].accountId);
      } catch (err) {
        console.error("Wallet init error:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (accountId) fetchContractData();
  }, [accountId]);

  const isLanding = location.pathname === "/";

  return (
    <div className="min-h-screen bg-darkbg text-gray-100 font-sans w-full overflow-x-hidden flex">
      {!isLanding && (
        <Sidebar
          accountId={accountId}
          contractId={contractId}
          userRole={userRole}
          onLogout={handleLogout}
          modal={modal}
        />
      )}

      <main className="flex-1 ml-0 lg:ml-64 p-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {accountId && (
            <>
              <Route
                path="/dashboard"
                element={
                  <DashboardPage
                    selector={selector}
                    accountId={accountId}
                    contractId={contractId}
                    metadata={metadata}
                    userBalance={userBalance}
                    totalSupply={totalSupply}
                    proposals={proposals}
                    userRole={userRole}
                  />
                }
              />
              <Route
                path="/buy-tokens"
                element={<BuyTokensPage wallet={wallet} accountId={accountId} />}
              />
              <Route path="/success" element={<TokenPurchaseSuccess />} />
              {userRole === "core" && (
                <Route
                  path="/core"
                  element={
                    <CoreDashboard
                      accountId={accountId}
                      selector={selector}
                      contractId={contractId}
                      userRole={userRole}
                    />
                  }
                />
              )}
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;