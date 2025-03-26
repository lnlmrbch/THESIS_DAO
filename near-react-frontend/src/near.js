import { connect, keyStores, WalletConnection } from 'near-api-js';

const nearConfig = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
  contractName: 'your-contract.testnet' // ⬅️ ändere diesen Wert!
};

export async function initNear() {
  const keyStore = new keyStores.BrowserLocalStorageKeyStore();

  const near = await connect({
    deps: { keyStore },
    ...nearConfig,
  });

  const wallet = new WalletConnection(near);
  return { near, wallet };
}
