import React, { useState } from "react";

export default function TokenTransferForm({ selector, accountId, contractId }) {
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = async () => {
    const wallet = await selector.wallet();
    await wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "ft_transfer",
            args: { receiver_id: receiver, amount: (parseFloat(amount) * 1e24).toString() },
            gas: "30000000000000",
            deposit: "1",
          },
        },
      ],
    });
  };

  return (
    <section className="bg-white border border-gray-200 shadow-md rounded-xl p-6 w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-indigo-700 mb-4 flex items-center gap-2">
        🚀 Token Transfer
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Empfänger Account ID</label>
          <input
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="z.B. user.testnet"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Anzahl Tokens</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="z.B. 10.5"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={handleTransfer}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition"
        >
          Transfer starten
        </button>
      </div>
    </section>
  );
}