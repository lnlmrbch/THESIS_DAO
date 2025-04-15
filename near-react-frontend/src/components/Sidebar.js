// src/components/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaCoins,
  FaCogs,
  FaSignOutAlt,
  FaThLarge,
  FaListAlt,
} from "react-icons/fa";
import { HiArrowCircleRight, HiUser, HiCurrencyDollar } from "react-icons/hi";

const Sidebar = ({ accountId, onLogout, userRole }) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", to: "/dashboard", icon: <FaThLarge /> },
    { name: "Proposals", to: "/proposals", icon: <FaListAlt /> },
    { name: "Buy Tokens", to: "/buy-tokens", icon: <FaCoins /> },
    { name: "Transfer", to: "/transfer", icon: <HiArrowCircleRight /> },
    ...(userRole === "core"
      ? [{ name: "Core Panel", to: "/core", icon: <FaCogs /> }]
      : []),
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#1A1529] text-white flex flex-col shadow-md z-50 border-r border-[#261d3b]">
      {/* Branding */}
      <div className="p-6 border-b border-[#261d3b]">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#A78BFA]">Thesis DAO</h1>
        <p className="text-xs text-gray-400 mt-1 truncate">{accountId}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map(({ name, to, icon }) => (
          <Link
            key={name}
            to={to}
            className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              location.pathname === to
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
      <div className="p-4 border-t border-[#261d3b]">
        <button
          onClick={onLogout}
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