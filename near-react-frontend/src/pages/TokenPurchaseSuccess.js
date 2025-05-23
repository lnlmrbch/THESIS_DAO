import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlus, FaHome, FaCheckCircle } from 'react-icons/fa';

const TokenPurchaseSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, timestamp } = location.state || {};

  if (!amount || !timestamp) {
    navigate('/buy-tokens');
    return null;
  }

  return (
    <div className="min-h-screen bg-pattern text-black flex items-center justify-center px-4 py-12">
      <div className="glass-effect proposal-hover p-10 rounded-2xl shadow-2xl text-center space-y-6 max-w-md w-full border border-green-400">
        <div className="flex justify-center items-center mb-2">
          <span className="bg-green-100 rounded-full p-4 flex items-center justify-center shadow-lg">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2c1c5b]">Token-Kauf erfolgreich!</h2>
        <p className="text-lg text-gray-700">
          Du hast <span className="text-green-600 font-bold">{amount} CHF</span> eingetauscht.
        </p>
        <p className="text-sm text-gray-400">Zeit: {timestamp}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/buy-tokens')}
            className="modern-button flex-1"
          >
            <FaPlus className="mr-2" /> Mehr kaufen
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="modern-button flex-1 bg-gray-200 text-[#2c1c5b] hover:bg-gray-300"
          >
            <FaHome className="mr-2" /> Zum Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenPurchaseSuccess;