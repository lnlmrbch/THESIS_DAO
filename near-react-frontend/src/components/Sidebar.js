import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaCoins,
  FaCogs,
  FaSignOutAlt,
  FaThLarge,
  FaListAlt,
  FaUser,
  FaPlayCircle,
} from "react-icons/fa";
import { HiArrowCircleRight } from "react-icons/hi";

const Sidebar = ({ accountId, onLogout, userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [hasProfile, setHasProfile] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    const loadProgress = async () => {
      if (!accountId) return;

      try {
        const res = await fetch(`/api/members/by-id/${accountId}`);
        setHasProfile(res.ok);
      } catch {
        setHasProfile(false);
      }

      try {
        const res = await fetch(`https://rpc.testnet.near.org`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "dontcare",
            method: "query",
            params: {
              request_type: "call_function",
              account_id: "dao.lioneluser.testnet",
              method_name: "ft_balance_of",
              args_base64: btoa(JSON.stringify({ account_id: accountId })),
              finality: "optimistic",
            },
          }),
        });
        const data = await res.json();
        const result = JSON.parse(
          Buffer.from(data.result.result).toString("utf8")
        );
        setUserBalance(parseFloat(result));
      } catch {
        setUserBalance(0);
      }
    };

    loadProgress();
  }, [accountId]);

  const stepsDone =
    (!!accountId ? 1 : 0) + (hasProfile ? 1 : 0) + (userBalance > 0 ? 1 : 0);
  const progressPercent = Math.round((stepsDone / 4) * 100);

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#1A1529] text-white flex flex-col shadow-md z-50 border-r border-[#261d3b]">
      {/* Branding */}
      <div className="p-6 border-b border-[#261d3b]">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#A78BFA]">Thesis DAO</h1>
        <p className="text-xs text-gray-400 mt-1 truncate">{accountId}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Getting Started hervorgehoben */}
        <Link
          to="/getting-started"
          className={`flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium transition-all ${location.pathname === "/getting-started"
              ? "bg-[#A78BFA] text-black shadow-sm"
              : "bg-[#2A2342] text-[#A78BFA] hover:bg-[#3B2D63]"
            }`}
        >
          <div className="flex items-center gap-3">
            <FaPlayCircle className="text-lg" />
            <span>Getting Started</span>
          </div>
          {progressPercent < 100 && (
            <span className="bg-[#A78BFA] text-[#1A1529] text-xs font-bold px-2 py-0.5 rounded-md">
              NEU
            </span>
          )}
        </Link>

        {/* Weitere Navigation */}
        {[
          { name: "Dashboard", to: "/dashboard", icon: <FaThLarge /> },
          { name: "Proposals", to: "/proposals", icon: <FaListAlt /> },
          { name: "Buy Tokens", to: "/buy-tokens", icon: <FaCoins /> },
          { name: "Transfer", to: "/transfer", icon: <HiArrowCircleRight /> },
          ...(userRole === "core"
            ? [{ name: "Core Panel", to: "/core", icon: <FaCogs /> }]
            : []),
        ].map(({ name, to, icon }) => (
          <Link
            key={name}
            to={to}
            className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all ${location.pathname === to
                ? "bg-[#A78BFA] text-black shadow-sm"
                : "hover:bg-[#2A2342] text-gray-300"
              }`}
          >
            <span className="text-lg">{icon}</span>
            <span>{name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#261d3b] space-y-3">
        {/* Fortschritt klickbar */}
        <Link to="/getting-started" className="block group">
          <p className="text-xs text-gray-400 mb-1 group-hover:text-[#A78BFA] transition">
            Onboarding-Fortschritt
          </p>
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#A78BFA] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 group-hover:text-[#A78BFA] transition">
            {progressPercent}% abgeschlossen – ansehen →
          </p>
        </Link>

        <Link
          to="/profile"
          className={`flex items-center justify-center gap-2 w-full py-2 rounded-md text-sm font-medium transition-all ${location.pathname === "/profile"
              ? "bg-[#A78BFA] text-black shadow-sm"
              : "hover:bg-[#2A2342] text-gray-300"
            }`}
        >
          <FaUser />
          Mein Profil
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-2 rounded-md hover:bg-red-700 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;