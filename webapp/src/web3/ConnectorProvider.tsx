import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { PropsWithChildren } from 'react'
import { metaMaskConnector, metaMaskHooks } from './connectors/metaMask'

/**
 * Example using the new `@web3-react`
 * https://github.com/Uniswap/web3-react/tree/main/packages/example-next
 */

const connectors: [MetaMask/*| WalletConnect | CoinbaseWallet | Network*/, Web3ReactHooks][] = [
  [metaMaskConnector, metaMaskHooks],
  // [walletConnect, walletConnectHooks],
  // [coinbaseWallet, coinbaseWalletHooks],
  // [network, networkHooks],
]

export default function ConnectorProvider({ children }: PropsWithChildren) {
  return (
    <Web3ReactProvider connectors={connectors}>
      {children}
    </Web3ReactProvider>
  )
}
