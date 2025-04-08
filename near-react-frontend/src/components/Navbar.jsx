import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ accountId, contractId, userRole, onLogout, modal }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const isLanding = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 w-full bg-cardbg border-b border-gray-800 z-50 px-6 h-16 flex justify-between items-center shadow-md backdrop-blur-md">
      {/* DAO Name & Logo */}
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          Thesis DAO
        </h1>
        {contractId && (
          <p className="text-xs text-gray-500 ml-6 -mt-1 hidden sm:block">
            Contract: <span className="text-white">{contractId}</span>
          </p>
        )}
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/" className="text-white hover:text-accent transition">Home</Link>

        {accountId ? (
          <>
            <Link to="/dashboard" className="text-white hover:text-accent transition">Dashboard</Link>
            <Link to="/buy-tokens" className="text-white hover:text-accent transition">Tokens kaufen</Link>

            {userRole === "core" && (
              <Link to="/core" className="text-white hover:text-accent transition">Core</Link>
            )}

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-3 text-sm text-white bg-gray-800 px-4 py-1.5 rounded-full border border-gray-700 shadow-inner hover:border-accent transition"
              >
                <span className="text-green-400 text-lg">🔒</span>
                <span className="font-semibold truncate max-w-[120px]">{accountId}</span>
                {userRole && (
                  <span className="bg-accent text-black px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    {userRole}
                  </span>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 text-white rounded-lg shadow-xl z-50 animate-fade-in">
                  <ul className="py-2">
                    <li>
                      <Link to="/account" className="block px-4 py-2 text-sm hover:bg-gray-700 transition">
                        Account Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            onClick={() => modal && modal.show()}
            className="bg-accent text-black font-bold px-6 py-2 rounded-full hover:brightness-110 transition"
          >
            Wallet verbinden
          </button>
        )}
      </div>
    </nav>
  );
}