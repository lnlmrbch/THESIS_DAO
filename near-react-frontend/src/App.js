import React, { useEffect, useState } from 'react';
import { initNear } from './near';

function App() {
  const [wallet, setWallet] = useState(null);
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    async function init() {
      const { wallet } = await initNear();
      setWallet(wallet);

      if (wallet.isSignedIn()) {
        setAccountId(wallet.getAccountId());
      }
    }
    init();
  }, []);

  const signIn = () => {
    wallet.requestSignIn();
  };

  const signOut = () => {
    wallet.signOut();
    window.location.reload();
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>NEAR Wallet Login</h1>
      {wallet && !wallet.isSignedIn() && (
        <button onClick={signIn}>Connect Wallet</button>
      )}
      {wallet && wallet.isSignedIn() && (
        <>
          <p>✅ Connected as: <strong>{accountId}</strong></p>
          <button onClick={signOut}>Sign Out</button>
        </>
      )}
    </div>
  );
}

export default App;
