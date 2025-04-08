// src/components/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCoins,
  FaCogs,
  FaSignOutAlt,
  FaThLarge,
} from "react-icons/fa";

const Sidebar = ({ accountId, onLogout, userRole }) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", to: "/dashboard", icon: <FaThLarge /> },
    { name: "Buy Tokens", to: "/buy-tokens", icon: <FaCoins /> },
    ...(userRole === "core"
      ? [{ name: "Core Panel", to: "/core", icon: <FaCogs /> }]
      : []),
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#0f0f13] text-white flex flex-col shadow-lg z-50 border-r border-[#1e1e24]">
      {/* Branding */}
      <div className="p-6 border-b border-[#1e1e24]">
        <h1 className="text-2xl font-extrabold tracking-tight text-accent">Thesis DAO</h1>
        <p className="text-sm text-gray-500 truncate mt-1">{accountId}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map(({ name, to, icon }) => (
          <Link
            key={name}
            to={to}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition duration-150 ease-in-out text-sm font-medium ${
              location.pathname === to
                ? "bg-accent text-black shadow-sm"
                : "hover:bg-[#1c1c22] text-gray-300"
            }`}
          >
            {icon}
            <span>{name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer Action */}
      <div className="p-4 border-t border-[#1e1e24]">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;