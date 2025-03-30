import React, { useState } from "react";
import { toYocto } from "../utils/format";

const TokenTransferForm = ({ selector, accountId, contractId }) => {
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = async () => {
    if (!receiver || !amount) {
      alert("Bitte fülle beide Felder aus.");
      return;
    }

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
              amount: toYocto(amount),
            },
            gas: "30000000000000",
            deposit: "1",
          },
        },
      ],
    });

    setReceiver("");
    setAmount("");
    alert("Transfer erfolgreich gesendet!");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-cardbg border border-gray-700 rounded-xl shadow-xl p-8 text-white">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <span className="text-accent">💸</span> Token Transfer
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Receiver account"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-400"
        />

        <input
          type="number"
          placeholder="Amount (LIONEL)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-400"
        />

        <button
          onClick={handleTransfer}
          className="w-full bg-gradient-to-r from-green-400 to-accent text-black font-semibold py-3 rounded-full shadow-md hover:brightness-110 transition"
        >
          Transfer
        </button>
      </div>
    </div>
  );
};

export default TokenTransferForm;
