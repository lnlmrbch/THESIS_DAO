import React, { useState } from "react";
import { FaPaperPlane, FaUser, FaCoins, FaExchangeAlt } from "react-icons/fa";

export default function TokenTransferPage({ selector, accountId, contractId }) {
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const handleTransfer = async () => {
    try {
      setIsLoading(true);
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

      // Aktivität in die DB schreiben
      await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId,
          type: "transfer",
          description: `Token Transfer an ${receiver} – ${amount} THESISDAO`,
          timestamp: new Date().toISOString(),
        }),
      });

      setStatus("✅ Token erfolgreich gesendet!");
      setReceiver("");
      setAmount("");
      setSuccess("✅ Token erfolgreich gesendet!");
    } catch (err) {
      console.error("Transfer-Fehler:", err);
      setStatus("❌ Fehler beim Transfer.");
      setError("❌ Fehler beim Transfer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pattern text-black px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="glass-effect p-8">
          <h1 className="text-3xl font-bold text-[#2c1c5b] mb-6 flex items-center gap-2">
            <FaExchangeAlt className="text-[#6B46C1]" />
            Token Transfer
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empfänger
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="account.near"
                className="w-full px-4 py-2 glass-effect focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Betrag in CHF
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 glass-effect focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent"
                />
                <span className="absolute right-4 top-2 text-gray-500">
                  {metadata?.symbol || "TOKEN"}
                </span>
              </div>
            </div>

            <div className="glass-effect p-4 bg-opacity-50">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Transaktion Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Von</span>
                  <span className="font-medium text-[#2c1c5b]">{accountId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">An</span>
                  <span className="font-medium text-[#2c1c5b]">{recipient || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Betrag</span>
                  <span className="font-medium text-[#2c1c5b]">
                    {amount ? `${amount} ${metadata?.symbol || "TOKEN"}` : "-"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleTransfer}
              disabled={!recipient || !amount || isLoading}
              className={`w-full modern-button ${(!recipient || !amount || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Transfer wird ausgeführt...
                </div>
              ) : (
                'Transfer ausführen'
              )}
            </button>

            {error && (
              <div className="glass-effect p-4 bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="glass-effect p-4 bg-green-50 border border-green-200">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}