// src/components/landing/Header.js
import React from 'react';
import { Link } from 'react-scroll';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold text-primary">Thesis DAO</div>
        <ul className="flex space-x-6">
          <li>
            <Link to="about" smooth duration={500} className="cursor-pointer text-gray-700 hover:text-primary">
              Über uns
            </Link>
          </li>
          <li>
            <Link to="tokenomics" smooth duration={500} className="cursor-pointer text-gray-700 hover:text-primary">
              Tokenomics
            </Link>
          </li>
          <li>
            <Link to="roadmap" smooth duration={500} className="cursor-pointer text-gray-700 hover:text-primary">
              Roadmap
            </Link>
          </li>
          <li>
            <Link to="faq" smooth duration={500} className="cursor-pointer text-gray-700 hover:text-primary">
              FAQ
            </Link>
          </li>
          <li>
            <Link to="contact" smooth duration={500} className="cursor-pointer text-gray-700 hover:text-primary">
              Kontakt
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;