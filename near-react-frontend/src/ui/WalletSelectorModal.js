import { useEffect } from "react";

function WalletSelectorModal({ modal }) {
  // Überprüfen, ob die modal.show Funktion existiert, bevor wir sie aufrufen
  useEffect(() => {
    if (modal && modal.show) {
      modal.show(); // Modal öffnen, wenn vorhanden
    } else {
      console.error("Modal instance is not properly passed.");
    }
  }, [modal]);

  return null; // Modal rendert sich selbst (via Portal)
}

export default WalletSelectorModal;