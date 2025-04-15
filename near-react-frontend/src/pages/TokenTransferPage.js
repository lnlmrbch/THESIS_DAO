// src/pages/TokenTransferPage.js
import React, { useState } from "react";
import { FaPaperPlane, FaUser, FaCoins } from "react-icons/fa";

export default function TokenTransferPage({ selector, accountId, contractId }) {
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState(null);

  const handleTransfer = async () => {
    try {
      const wallet = await selector.wallet();
      await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: contractId,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "ft_transfer",
              args: {
                receiver_id: receiver,
                amount: (parseFloat(amount) * 1e24).toString(),
              },
              gas: "30000000000000",
              deposit: "1",
            },
          },
        ],
      });
      setStatus("✅ Token erfolgreich gesendet!");
      setReceiver("");
      setAmount("");
    } catch (err) {
      console.error("Transfer-Fehler:", err);
      setStatus("❌ Fehler beim Transfer.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-black px-6 py-12 m-full">
      <h1 className="text-3xl font-bold text-[#2c1c5b] flex items-center gap-2">
        <FaPaperPlane className="text-primary" /> Token senden
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <FaUser /> Empfänger Account ID
          </label>
          <input
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="z.B. user.testnet"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <FaCoins /> Anzahl Tokens (LIONEL)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="z.B. 10.5"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md text-black"
          />
        </div>

        <button
          onClick={handleTransfer}
          className="w-full py-3 bg-primary text-white font-semibold rounded-md hover:brightness-110 transition flex justify-center items-center gap-2"
        >
          <FaPaperPlane /> Transfer starten
        </button>

        {status && <p className="text-sm text-primary">{status}</p>}
      </div>
    </div>
  );
}