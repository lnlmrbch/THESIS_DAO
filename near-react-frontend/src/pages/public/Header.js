// src/components/landing/Header.js
import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { FaBars, FaTimes, FaWallet } from 'react-icons/fa';

const navLinks = [
  { to: 'about', label: 'Über uns' },
  { to: 'tokenomics', label: 'Tokenomics' },
  { to: 'roadmap', label: 'Roadmap' },
  { to: 'faq', label: 'FAQ' },
  { to: 'contact', label: 'Kontakt' },
];

const Header = ({ connectWallet }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="max-w-7xl mx-auto mt-4 rounded-2xl bg-white/70 backdrop-blur-md shadow-xl border border-blue-100 flex items-center justify-between px-6 py-3 transition-all">
        {/* Logo */}
        <div className="text-2xl font-extrabold bg-gradient-to-r from-primary via-blue-500 to-accent text-transparent bg-clip-text drop-shadow-lg tracking-tight select-none">
          Thesis DAO
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex space-x-8 text-lg font-medium">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  smooth
                  duration={500}
                  className="cursor-pointer px-3 py-1 rounded-lg text-gray-700 hover:text-primary hover:bg-blue-50/70 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white shadow-sm hover:shadow-primary/30 hover:drop-shadow-glow"
                  activeClass="text-primary font-bold"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            onClick={connectWallet}
            className="ml-4 flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-primary via-blue-500 to-accent text-white font-semibold shadow-lg hover:brightness-110 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white"
          >
            <FaWallet className="text-lg" />
            Wallet verbinden
          </button>
        </div>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl text-primary focus:outline-none"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menü öffnen"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex flex-col items-center justify-start pt-24 md:hidden">
          <div className="bg-white/90 rounded-2xl shadow-2xl border border-blue-100 w-11/12 max-w-sm p-8 flex flex-col space-y-6 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                smooth
                duration={500}
                className="cursor-pointer text-lg font-semibold text-gray-700 hover:text-primary hover:bg-blue-50/70 px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white"
                activeClass="text-primary font-bold"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { setMenuOpen(false); connectWallet(); }}
              className="mt-4 flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary via-blue-500 to-accent text-white font-semibold shadow-lg hover:brightness-110 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white"
            >
              <FaWallet className="text-lg" />
              Wallet verbinden
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;