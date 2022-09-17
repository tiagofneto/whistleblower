import { MetaMask } from '@web3-react/metamask'
import type { Connector } from '@web3-react/types'

export function getName(connector: Connector) {
  if (connector instanceof MetaMask) return 'MetaMask'
  // if (connector instanceof WalletConnect) return 'WalletConnect'
  // if (connector instanceof CoinbaseWallet) return 'Coinbase Wallet'
  // if (connector instanceof Network) return 'Network'
  // if (connector instanceof GnosisSafe) return 'Gnosis Safe'
  return 'Unknown'
}
