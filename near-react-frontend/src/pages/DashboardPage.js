import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaWallet,
  FaListAlt,
  FaHandPaper,
  FaHistory,
  FaChartLine,
  FaVoteYea,
  FaUsers,
  FaClock,
  FaInfoCircle,
  FaChartPie,
  FaCalendarAlt,
  FaLightbulb,
  FaMoneyBillWave,
  FaArrowRight,
  FaCoins,
  FaExchangeAlt,
  FaUserCircle,
} from "react-icons/fa";
import TokenInfo from "../components/TokenInfo";
import ProposalOverview from "../components/ProposalOverview";
import { BASENAME } from "../App";
import { providers } from "near-api-js";

const API_URL = process.env.REACT_APP_API_URL || "";
const TREASURY_ACCOUNT = "treasury.dao.lioneluser.testnet";
const TEAM_ACCOUNT = "team.dao.lioneluser.testnet";

const DashboardPage = ({
  accountId,
  contractId,
  metadata,
  userBalance,
  totalSupply,
  proposals,
  userRole,
  tokenPool,
  communityTreasury,
  teamTokens,
}) => {
  const cardStyle =
    "flex items-center gap-4 p-6 bg-white shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200";

  const [userName, setUserName] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activeProposals, setActiveProposals] = useState([]);
  const [votingPower, setVotingPower] = useState(0);
  const [treasuryBalance, setTreasuryBalance] = useState(null);
  const [teamBalance, setTeamBalance] = useState(null);

  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Guten Morgen";
    if (hour < 18) return "Guten Nachmittag";
    return "Guten Abend";
  };

  const maskAccountId = (id) => {
    if (!id) return "";
    const parts = id.split(".");
    if (parts.length > 1) {
      const name = parts[0];
      const domain = parts.slice(1).join(".");
      if (name.length > 4) {
        return name.slice(0, 2) + "****" + name.slice(-1) + "." + domain;
      } else {
        return id; // Keine Maskierung, wenn der Name zu kurz ist
      }
    } else {
      return id; // Keine Maskierung, wenn kein Punkt vorhanden ist (ungültige NEAR-ID)
    }
  };

  useEffect(() => {
    const fetchName = async () => {
      try {
        const res = await fetch(`${API_URL}/api/members/by-id/${accountId}`);
        if (res.ok) {
          const data = await res.json();
          setUserName(data.name);
        }
      } catch (err) {
        console.error("Fehler beim Laden des Benutzernamens:", err);
      }
    };

    if (accountId) fetchName();
  }, [accountId]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(`${API_URL}/api/activities`);
        const data = await res.json();
        setActivities(data);
      } catch (err) {
        console.error("Fehler beim Laden der Aktivitäten:", err);
      }
    };

    if (accountId) fetchActivity();
  }, [accountId]);

  useEffect(() => {
    // Show all proposals
    setActiveProposals(proposals);

    // Calculate voting power based on circulating supply
    const HARDCAP = 10_000_000;
    const decimals = metadata?.decimals || 24;
    const safeParse = (val) => {
      const n = parseFloat(val);
      return isNaN(n) ? 0 : n;
    };
    const total = safeParse(totalSupply);
    const pool = safeParse(tokenPool);
    const user = safeParse(userBalance);
    const circulatingSupply = total - pool;

    // Debug-Log
    console.log({
      total,
      pool,
      user,
      circulatingSupply
    });

    let votingPower = 0;
    if (circulatingSupply > 0) {
      votingPower = (user / circulatingSupply) * 100;
    }
    setVotingPower(votingPower);
  }, [proposals, userBalance, totalSupply, tokenPool]);

  useEffect(() => {
    const fetchSpecialBalances = async () => {
      const provider = new providers.JsonRpcProvider("https://rpc.testnet.near.org");
      // Treasury
      const treasuryRes = await provider.query({
        request_type: "call_function",
        account_id: contractId,
        method_name: "ft_balance_of",
        args_base64: Buffer.from(JSON.stringify({ account_id: TREASURY_ACCOUNT })).toString("base64"),
        finality: "optimistic",
      });
      const decodedTreasury = new TextDecoder().decode(new Uint8Array(treasuryRes.result));
      setTreasuryBalance(decodedTreasury);
      // Team
      const teamRes = await provider.query({
        request_type: "call_function",
        account_id: contractId,
        method_name: "ft_balance_of",
        args_base64: Buffer.from(JSON.stringify({ account_id: TEAM_ACCOUNT })).toString("base64"),
        finality: "optimistic",
      });
      const decodedTeam = new TextDecoder().decode(new Uint8Array(teamRes.result));
      setTeamBalance(decodedTeam);
    };
    fetchSpecialBalances();
  }, [contractId]);

  function formatYoctoToToken(rawBalance, decimals = 24) {
    if (!rawBalance) return "0";
    try {
      const value = Number(rawBalance) / Math.pow(10, decimals);
      return value.toLocaleString("de-CH", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    } catch (e) {
      console.error("Error in formatYoctoToToken:", e);
      return "0";
    }
  }

  // Hilfswerte für menschenlesbare Anzeige
  const HARDCAP = 10_000_000;
  const safeParse = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };
  const decimals = metadata?.decimals || 24;
  const total = safeParse(totalSupply);
  const pool = safeParse(tokenPool);
  const treasury = safeParse(communityTreasury);
  const team = safeParse(teamTokens);
  const user = safeParse(userBalance);
  const circulatingSupply = total - pool;
  const sold = (total - pool) / Math.pow(10, decimals);
  const soldDisplay = sold < 0 || !isFinite(sold) ? 0 : sold;
  const percent = soldDisplay ? Math.min(100, (soldDisplay / HARDCAP) * 100) : 0;
  const percentDisplay = percent < 0 || !isFinite(percent) ? 0 : percent;

  // Nur noch Konsolen-Logging für Debugging

  return (
    <div className="px-6 py-10 bg-pattern text-black min-h-screen space-y-8 relative">
      {/* Overlay für Nutzer ohne Token-Balance */}
      {parseFloat(userBalance) <= 0 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-8 py-6 rounded-xl shadow text-center max-w-md">
            <h2 className="text-xl font-bold mb-2">Tokens erforderlich</h2>
            <p className="mb-4">Du benötigst THESISDAO Tokens, um alle Dashboard-Funktionen zu sehen.</p>
            <a
              href={`${BASENAME}/buy-tokens`}
              className="modern-button bg-primary text-white px-6 py-2 rounded"
            >
              Jetzt Tokens kaufen
            </a>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="glass-effect p-8 rounded-xl">
        <h1 className="text-3xl font-bold text-[#2c1c5b] mb-2 flex items-center gap-3">
          <FaHandPaper className="text-[#6B46C1]" />
          {getGreeting()}, {userName || accountId.split(".")[0]}
        </h1>
        <p className="text-gray-600">Willkommen in deinem DAO Dashboard. Hier findest du alle wichtigen Informationen und Aktivitäten.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-effect proposal-hover p-6 rounded-xl">
          <FaUserShield className="text-2xl text-[#6B46C1]" />
          <div>
            <p className="text-sm text-gray-500">Deine Rolle</p>
            <p className="text-lg font-semibold capitalize text-[#2c1c5b]">
              {userRole}
            </p>
          </div>
        </div>
        <div className="glass-effect proposal-hover p-6 rounded-xl">
          <FaWallet className="text-2xl text-[#6B46C1]" />
          <div>
            <p className="text-sm text-gray-500">Token Balance</p>
            <p className="text-lg font-semibold text-[#2c1c5b]">
              {(parseFloat(userBalance) / Math.pow(10, metadata?.decimals || 24)).toFixed(2)}{" "}
              {metadata?.symbol}
            </p>
          </div>
        </div>
        <div className="glass-effect proposal-hover p-6 rounded-xl">
          <FaVoteYea className="text-2xl text-[#6B46C1]" />
          <div>
            <p className="text-sm text-gray-500">Voting Power</p>
            <p className="text-lg font-semibold text-[#2c1c5b]">
              {votingPower.toFixed(2)}%
            </p>
          </div>
        </div>
        <div className="glass-effect proposal-hover p-6 rounded-xl">
          <FaListAlt className="text-2xl text-[#6B46C1]" />
          <div>
            <p className="text-sm text-gray-500">Aktive Proposals</p>
            <p className="text-lg font-semibold text-[#2c1c5b]">
              {activeProposals.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Active Proposals & More */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Proposals Card */}
          <div className="glass-effect proposal-hover rounded-xl">
            <div className="card-header px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#2c1c5b] flex items-center gap-2">
                  <FaClock className="text-[#6B46C1]" /> Aktive Proposals
                </h2>
                <button
                  onClick={() => navigate("/proposals")}
                  className="modern-button"
                >
                  Alle Proposals
                  <FaArrowRight />
                </button>
              </div>
            </div>
            <div className="card-content px-6 py-4">
              {activeProposals.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Keine aktiven Proposals vorhanden.</p>
              ) : (
                <div className="space-y-4">
                  {activeProposals.slice(0, 3).map((proposal) => (
                    <div
                      key={proposal.id}
                      onClick={() => navigate(`/proposals/${proposal.id}`)}
                      className="glass-effect p-4 rounded-lg hover:scale-[1.02] cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-[#2c1c5b] group-hover:text-[#6B46C1] transition-colors">
                            #{proposal.id} · {proposal.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                            {proposal.description}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {(() => {
                            const totalVotes = (proposal.votes_for?.length || 0) + (proposal.votes_against?.length || 0);
                            return totalVotes === 0 ? "Keine Stimmen" : `${totalVotes} Stimmen`;
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>Erstellt von {proposal.proposer}</span>
                        <span>{new Date(proposal.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  {activeProposals.length > 3 && (
                    <div className="text-center pt-2">
                      <span className="text-sm text-gray-500">
                        + {activeProposals.length - 3} weitere Proposals
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Activity Overview */}
          <div className="glass-effect proposal-hover rounded-xl">
            <div className="card-header px-6 py-4">
              <h2 className="text-xl font-bold text-[#2c1c5b] flex items-center gap-2">
                <FaHistory className="text-[#6B46C1]" /> Letzte Kaufaktivitäten
              </h2>
            </div>
            <div className="card-content px-6 py-4">
              {activities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Keine Aktivitäten vorhanden.</p>
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity, index) => (
                    <div key={index} className="glass-effect p-3 flex items-start gap-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6B46C1] text-white flex items-center justify-center shadow-md">
                         {activity.type === "buy" && <FaCoins className="w-4 h-4" />}
                          {activity.type === "transfer" && <FaExchangeAlt className="w-4 h-4" />}
                          {activity.type === "proposal" && <FaListAlt className="w-4 h-4" />}
                          {activity.type === "vote" && <FaVoteYea className="w-4 h-4" />}
                      </div>
                      <div className="flex-grow">
                          <p className="text-xs text-gray-500 font-medium">{new Date(activity.timestamp).toLocaleString()}</p>
                          <p className="text-sm text-gray-800 mt-0.5">{activity.description}</p>
                          <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                            <FaUserCircle className="text-[#6B46C1]"/> {maskAccountId(activity.accountId)}
                          </p>
                        </div>
                    </div>
                  ))}
                  {activities.length > 5 && (
                    <div className="text-center pt-2">
                      <span className="text-sm text-gray-500">
                        + {activities.length - 5} weitere Aktivitäten
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-8">
          {/* Token Sale Progress */}
          <div className="glass-effect proposal-hover rounded-xl">
            <div className="card-header px-6 py-4">
              <h2 className="text-xl font-bold text-[#2c1c5b] flex items-center gap-2">
                <FaChartLine className="text-[#6B46C1]" /> Token Sale Fortschritt
              </h2>
            </div>
            <div className="card-content px-6 py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Verteilte Tokens (verkauft, Treasury & Team)</span>
                  <span className="font-semibold text-[#2c1c5b]">
                    {soldDisplay.toLocaleString(undefined, { maximumFractionDigits: 2 })} / {HARDCAP.toLocaleString()} {metadata?.symbol}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#6B46C1] h-2.5 rounded-full"
                    style={{ width: `${percentDisplay}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 text-right">{`${percentDisplay.toFixed(2)}% abgeschlossen`}</p>
              </div>
            </div>
          </div>

          {/* Token Distribution */}
          <div className="glass-effect proposal-hover rounded-xl">
            <div className="card-header px-6 py-4">
              <h2 className="text-xl font-bold text-[#2c1c5b] flex items-center gap-2">
                <FaChartPie className="text-[#6B46C1]" /> Token Verteilung
              </h2>
            </div>
            <div className="card-content px-6 py-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600">Community</span>
                    <span className="font-semibold text-[#2c1c5b]">
                      60%{tokenPool !== undefined && tokenPool !== null && (
                        <> · {formatYoctoToToken(tokenPool)} {metadata?.symbol}</>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#6B46C1] h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600">Treasury</span>
                    <span className="font-semibold text-[#2c1c5b]">
                      30%{treasuryBalance !== null && (
                        <> · {formatYoctoToToken(JSON.parse(treasuryBalance))} {metadata?.symbol}</>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#6B46C1] h-2 rounded-full" style={{ width: "30%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600">Team</span>
                    <span className="font-semibold text-[#2c1c5b]">
                      10%{teamBalance !== null && (
                        <> · {formatYoctoToToken(JSON.parse(teamBalance))} {metadata?.symbol}</>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#6B46C1] h-2 rounded-full" style={{ width: "10%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Events */}
          <div className="glass-effect proposal-hover rounded-xl">
            <div className="card-header px-6 py-4">
              <h2 className="text-xl font-bold text-[#2c1c5b] flex items-center gap-2">
                <FaCalendarAlt className="text-[#6B46C1]" /> Events
              </h2>
            </div>
            <div className="card-content px-6 py-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#6B46C1] bg-opacity-10 rounded-lg">
                    <FaCalendarAlt className="text-[#6B46C1]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#2c1c5b]">Abgabe Bachelorthesis</h4>
                    <p className="text-sm text-gray-600">28. Mai 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#6B46C1] bg-opacity-10 rounded-lg">
                    <FaCalendarAlt className="text-[#6B46C1]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#2c1c5b]">DAO Strategie-Workshop</h4>
                    <p className="text-sm text-gray-600">15. November 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;