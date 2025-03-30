import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";

import "@near-wallet-selector/modal-ui/styles.css";

export const initWalletSelector = async () => {
  const selector = await setupWalletSelector({
    network: "testnet",
    modules: [
      setupMyNearWallet(),
      setupMeteorWallet(),
    ],
  });

  const modal = setupModal(selector, {
    contractId: "dao.lioneluser.testnet", // 👉 deinen echten Contract eintragen
    theme: "dark", // oder "light"
  });

  return { selector, modal };
};
