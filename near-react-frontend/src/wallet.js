import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";

import "@near-wallet-selector/modal-ui/styles.css";

// Initialisiert den Wallet Selector und das Modal
export const initWalletSelector = async () => {
  const selector = await setupWalletSelector({
    network: "testnet",
    modules: [
      setupMyNearWallet(),
      setupMeteorWallet(),
    ],
  });

  const modal = setupModal(selector, {
    contractId: "dao.lioneluser.testnet",
    theme: "light",
  });

  return { selector, modal };
};

// Funktion zum Ausloggen des Benutzers
export const logout = async (selector) => {
  const wallet = await selector.wallet();
  await wallet.signOut();
  window.location.reload();  // Seite neu laden, um den Zustand zu aktualisieren
};