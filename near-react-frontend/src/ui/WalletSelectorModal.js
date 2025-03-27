import { useEffect } from "react";

function WalletSelectorModal({ modal }) {
  useEffect(() => {
    modal.show(); // Modal öffnen, sobald Komponente geladen wird
  }, [modal]);

  return null; // Modal rendert sich selbst (via Portal)
}

export default WalletSelectorModal;
