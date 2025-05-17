import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlus, FaHome } from 'react-icons/fa';

const TokenPurchaseSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, timestamp } = location.state || {};

  if (!amount || !timestamp) {
    navigate('/buy-tokens');
    return null;
  }

  return (
    <div className="min-h-screen bg-darkbg text-white flex items-center justify-center px-4">
      <div className="bg-cardbg p-10 rounded-xl border border-green-500 shadow-2xl text-center space-y-6 max-w-md w-full">
        <div className="text-5xl">🎉</div>
        <h2 className="text-3xl font-bold text-accent">Token-Kauf erfolgreich!</h2>
        <p className="text-lg">
          Du hast <span className="text-green-400 font-bold">{amount} NEAR</span> eingetauscht.
        </p>
        <p className="text-sm text-gray-400">Zeit: {timestamp}</p>
        <div className="flex justify-center space-x-4 pt-4">
          <button
            onClick={() => navigate('/buy-tokens')}
            className="modern-button"
          >
            <FaPlus className="mr-2" /> Mehr kaufen
          </button>
          <button
            onClick={() => navigate('/')}
            className="modern-button bg-gray-700 hover:bg-gray-600"
          >
            <FaHome className="mr-2" /> Zurück zur DAO
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenPurchaseSuccess;