import React from "react";

export default function Navbar({ accountId }) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-cardbg border-b border-gray-700 z-50 px-6 h-16 flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-bold text-white flex items-center gap-2">
        <div className="w-3 h-3 bg-accent rounded-full"></div>
        Lionel Thesis DAO
      </h1>

      <div className="flex items-center gap-4">
        {accountId ? (
          <div className="flex items-center gap-2 text-sm text-white bg-gray-800 px-4 py-1.5 rounded-full border border-gray-600">
            <span className="text-green-400 text-lg">🔒</span>
            {accountId}
          </div>
        ) : (
          <button className="bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition">
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}
