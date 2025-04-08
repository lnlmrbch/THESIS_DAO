import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BuyTokensPage = ({ wallet, accountId }) => {
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 📦 Wenn NEAR Wallet redirectet → automatisch auf /success weiterleiten
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const txHash = params.get("transactionHashes");

    if (txHash) {
      const storedAmount = localStorage.getItem("lastBuyAmount") || "unbekannt";
      localStorage.removeItem("lastBuyAmount");

      navigate('/success', {
        state: {
          amount: storedAmount,
          timestamp: new Date().toLocaleString(),
        },
      });
    }
  }, [location.search, navigate]);

  const handleBuy = async () => {
    if (!wallet || !accountId) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Bitte gib eine gültige NEAR-Menge ein.');
      return;
    }

    const yoctoAmount = BigInt(parsedAmount * 1e24).toString();
    localStorage.setItem("lastBuyAmount", parsedAmount); // 💾 Zwischenspeichern

    try {
      await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: 'dao.lioneluser.testnet',
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: 'buy_tokens',
              args: {},
              gas: '300000000000000',
              deposit: yoctoAmount,
            },
          },
        ],
      });

      // 🚀 Weiterleitung erfolgt nach Wallet-Redirect (siehe oben)
    } catch (err) {
      console.error('❌ Kauf fehlgeschlagen:', err);
      alert('Fehler beim Token-Kauf.');
    }
  };

  if (!wallet || !accountId) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold">
        ❌ Bitte melde dich an, um Token zu kaufen.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkbg text-white flex items-center justify-center px-4">
      <div className="bg-cardbg p-10 rounded-xl border border-gray-700 shadow-2xl space-y-6 max-w-md w-full">
        <h2 className="text-3xl font-bold text-accent text-center">💸 Token kaufen</h2>
        <p className="text-center text-gray-400">
          Eingeloggt als: <span className="text-white">{accountId}</span>
        </p>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Menge in NEAR"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={handleBuy}
            className="w-full py-3 bg-gradient-to-r from-green-400 to-accent text-black font-bold rounded-full hover:brightness-110 transition"
          >
            Kaufen
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyTokensPage;