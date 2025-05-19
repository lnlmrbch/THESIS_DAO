import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { initWalletSelector } from "./wallet";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/public/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import CoreDashboard from "./pages/CoreDashboard";
import BuyTokensPage from "./pages/BuyTokensPage";
import TokenPurchaseSuccess from "./pages/TokenPurchaseSuccess";
import ProposalsPage from "./pages/ProposalsPage";
import CreateProposalPage from "./pages/CreateProposalPage";
import ProposalDetailPage from "./pages/ProposalDetailPage";
import TokenTransferPage from "./pages/TokenTransferPage";
import DistributeDividendsPage from "./pages/DistributeDividendsPage";
import UserProfilePage from "./pages/UserProfilePage";
import GettingStartedPage from "./pages/GettingStartedPage";
import DAOChatbot from "./components/DaoChatbot";
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
  const [hasProfile, setHasProfile] = useState(null);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [tokenPool, setTokenPool] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === "/";
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
      const [meta, balance, supply, props, role, pool] = await Promise.all([
        fetchView("ft_metadata"),
        fetchView("ft_balance_of", { account_id: accountId }),
        fetchView("ft_total_supply"),
        fetchView("get_proposals"),
        fetchView("get_role", { account_id: accountId }),
        fetchView("get_token_pool"),
      ]);

      setMetadata(meta);
      setUserBalance(balance);
      setTotalSupply(supply);
      setProposals(props);
      setUserRole(role);
      setTokenPool(pool);
    }
  };

  const handleLogout = async () => {
    const wallet = await selector.wallet();
    if (wallet) {
      await wallet.signOut();
      setAccountId(null);
      setUserRole(null);
      setHasProfile(null);
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
        setJustLoggedIn(true); // <- markiere als frisch eingeloggt
      } catch (err) {
        console.error("Wallet init error:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (accountId) fetchContractData();
  }, [accountId]);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!accountId) return;

      try {
        const res = await fetch(`/api/members/by-id/${accountId}`);
        if (res.status === 404) {
          setHasProfile(false);
          if (location.pathname !== "/profile") navigate("/profile");
        } else if (res.ok) {
          setHasProfile(true);
        }
      } catch (err) {
        console.error("❌ Fehler beim Profilcheck:", err);
        setHasProfile(false);
      }
    };

    checkUserProfile();
  }, [accountId, location.pathname, navigate]);

  useEffect(() => {
    if (!accountId || hasProfile === null || userBalance === null) return;
  
    const progress =
      (!!accountId ? 1 : 0) +
      (hasProfile ? 1 : 0) +
      (userBalance > 0 ? 1 : 0);
  
    const state = selector?.store.getState();
    const loggedInViaLogin = state?.lastModal === "signIn";
  
    if (
      loggedInViaLogin &&
      progress < 3 &&
      location.pathname === "/dashboard"
    ) {
      navigate("/getting-started");
    }
  }, [accountId, hasProfile, userBalance, selector, location.pathname, navigate]);


  return (
    <div className={`min-h-screen text-gray-100 font-sans w-full overflow-x-hidden ${isLanding ? "bg-white" : "bg-darkbg flex"}`}>
      {!isLanding && (
        <Sidebar
          accountId={accountId}
          contractId={contractId}
          userRole={userRole}
          onLogout={handleLogout}
          modal={modal}
        />
      )}

      <main className={`flex-1 ${!isLanding ? "ml-0 lg:ml-64" : ""}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {accountId && hasProfile !== null && (
            <>
              {!hasProfile ? (
                <Route path="/profile" element={<UserProfilePage accountId={accountId} />} />
              ) : (
                <>
                  <Route path="/dashboard" element={
                    <DashboardPage
                      selector={selector}
                      accountId={accountId}
                      contractId={contractId}
                      metadata={metadata}
                      userBalance={userBalance}
                      totalSupply={totalSupply}
                      tokenPool={tokenPool}
                      proposals={proposals}
                      userRole={userRole}
                    />
                  } />
                  <Route path="/buy-tokens" element={<BuyTokensPage wallet={wallet} accountId={accountId} />} />
                  <Route path="/success" element={<TokenPurchaseSuccess />} />
                  <Route path="/proposals" element={
                    <ProposalsPage
                      selector={selector}
                      accountId={accountId}
                      contractId={contractId}
                      metadata={metadata}
                      userBalance={userBalance}
                      totalSupply={totalSupply}
                      proposals={proposals}
                    />
                  } />
                  <Route path="/proposals/new" element={<CreateProposalPage selector={selector} contractId={contractId} accountId={accountId} />} />
                  <Route path="/proposals/:id" element={
                    <ProposalDetailPage
                      selector={selector}
                      contractId={contractId}
                      accountId={accountId}
                      userRole={userRole}
                    />
                  } />
                  <Route path="/transfer" element={
                    <TokenTransferPage
                      selector={selector}
                      accountId={accountId}
                      contractId={contractId}
                    />
                  } />
                  <Route
                    path="/getting-started"
                    element={
                      <GettingStartedPage
                        accountId={accountId}
                        userBalance={userBalance}
                      />
                    }
                  />
                  <Route path="/profile" element={<UserProfilePage accountId={accountId} />} />

                  {userRole === "core" && (
                    <>
                      <Route path="/core" element={
                        <CoreDashboard
                          accountId={accountId}
                          selector={selector}
                          contractId={contractId}
                          userRole={userRole}
                        />
                      } />
                      <Route path="/distribute-dividends" element={
                        <DistributeDividendsPage
                          selector={selector}
                          accountId={accountId}
                          contractId={contractId}
                        />
                      } />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Routes>
      </main>

      {!isLanding && <DAOChatbot />}
    </div>
  );
}

export default App;