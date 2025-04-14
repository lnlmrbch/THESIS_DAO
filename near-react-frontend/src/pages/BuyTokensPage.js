// src/pages/BuyTokensPage.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BuyTokensPage = ({ wallet, accountId }) => {
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const txHash = params.get("transactionHashes");

    if (txHash) {
      const storedAmount = localStorage.getItem("lastBuyAmount") || "unbekannt";
      localStorage.removeItem("lastBuyAmount");
      navigate("/success", {
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
      alert("Bitte gib eine gültige NEAR-Menge ein.");
      return;
    }

    const yoctoAmount = BigInt(parsedAmount * 1e24).toString();
    localStorage.setItem("lastBuyAmount", parsedAmount);

    try {
      await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: "dao.lioneluser.testnet",
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "buy_tokens",
              args: {},
              gas: "300000000000000",
              deposit: yoctoAmount,
            },
          },
        ],
      });
    } catch (err) {
      console.error("❌ Kauf fehlgeschlagen:", err);
      alert("Fehler beim Token-Kauf.");
    }
  };

  if (!wallet || !accountId) {
    return (
      <div className="p-12 text-center text-red-500 font-semibold">
        ❌ Bitte melde dich an, um Token zu kaufen.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-black py-16 px-6">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-[#2c1c5b]">💸 Token kaufen</h1>
          <p className="text-sm text-gray-600">
            Eingeloggt als: <span className="font-semibold">{accountId}</span>
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Betrag in NEAR
            </label>
            <input
              type="number"
              placeholder="z. B. 10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={handleBuy}
            className="w-full py-3 bg-primary text-white font-semibold rounded-md hover:brightness-105 transition"
          >
            Jetzt kaufen
          </button>
        </div>

        <div className="space-y-8 mt-8">
          <div className="text-sm text-gray-700">
            <h2 className="text-md font-semibold mb-2 text-[#2c1c5b]">Warum Tokens kaufen?</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Erhalte Stimmrechte in der DAO</li>
              <li>Unterstütze neue Vorschläge</li>
              <li>Werde Teil einer aktiven Community</li>
            </ul>
          </div>

          <div className="text-sm text-gray-700">
            <h2 className="text-md font-semibold mb-2 text-[#2c1c5b]">Sicherheitshinweise</h2>
            <p>
              Transaktionen werden über die NEAR Wallet signiert. Stelle sicher, dass du genügend
              NEAR für Gebühren hast.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyTokensPage;