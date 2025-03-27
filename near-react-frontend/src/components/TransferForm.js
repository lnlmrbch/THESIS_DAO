// components/TokenTransferForm.js
import React, { useState } from "react";
import { toYocto } from "../utils/format";

const TokenTransferForm = ({ selector, accountId, contractId }) => {
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = async () => {
    if (!receiver || !amount) {
      alert("Please fill in both fields.");
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
            deposit: "1", // exactly 1 yoctoNEAR
          },
        },
      ],
    });
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>💸 Transfer LIONEL</h2>
      <input
        placeholder="Receiver account"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <input
        placeholder="Amount (LIONEL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <button onClick={handleTransfer}>Send</button>
    </div>
  );
};

export default TokenTransferForm;
