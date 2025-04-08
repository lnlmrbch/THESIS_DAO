import { connect, keyStores, WalletConnection } from 'near-api-js';

const nearConfig = {
  networkId: 'testnet', // Achte darauf, dass 'testnet' korrekt ist
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
  contractName: 'dao.lioneluser.testnet', // Stelle sicher, dass dies korrekt ist
};

// Initialisiert die NEAR-Verbindung und das Wallet
export async function initNear() {
  const keyStore = new keyStores.BrowserLocalStorageKeyStore();

  try {
    // Verbindet mit der NEAR Blockchain
    const near = await connect({
      deps: { keyStore },
      ...nearConfig,
    });

    // Initialisiert die Wallet-Verbindung
    const wallet = new WalletConnection(near);

    // Überprüfen, ob der Benutzer eingeloggt ist, falls nicht, leite den Benutzer zur Login-Seite
    if (!wallet.isSignedIn()) {
      console.log("User is not signed in, please sign in.");
      return { wallet: null, error: "User not signed in" }; // Rückgabe von Fehlernachricht
    }

    // Gibt die Wallet-Verbindung zurück
    return { wallet, error: null };
  } catch (error) {
    console.error("Fehler beim Initialisieren des NEAR Wallets:", error);
    return { wallet: null, error: "Failed to initialize NEAR wallet" }; // Fehlerstatus
  }
}

// Funktion zum Abmelden des Benutzers
export const logout = async (selector) => {
  const wallet = await selector.wallet();
  await wallet.signOut();
  window.location.reload(); // Seite neu laden, um den Zustand zu aktualisieren
};