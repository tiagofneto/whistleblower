import type { Web3ReactHooks } from '@web3-react/core'
import type { MetaMask } from '@web3-react/metamask'
import { useCallback } from 'react'
import useToggle from 'src/hooks/useToggle'


export function ConnectButton({
  connector,
  chainId,
  isActivating,
  isActive,
  error,
  setError,
  interactingState,
}: {
  connector: MetaMask //| WalletConnect | CoinbaseWallet | Network | GnosisSafe
  chainId: ReturnType<Web3ReactHooks['useChainId']>
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
  isActive: ReturnType<Web3ReactHooks['useIsActive']>
  error: Error | undefined
  setError: (error: Error | undefined) => void
  interactingState: ReturnType<typeof useToggle>
}) {
  const desiredChainId = 1

  const [interacting, , , setInteracting, setFinished] = interactingState

  const connect = useCallback((): void => {
    setError(undefined)
    setInteracting()
    connector
      .activate(desiredChainId)
      .catch(setError)
      .finally(setFinished)
  }, [connector, desiredChainId, setError])

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {
        /* ERROR         */ error ? <button style={{ cursor: 'pointer' }} onClick={connect}>Try Again?</button>
                            // @ts-expect-error Property connector.actions is protected...
        /* DISCONNECT  */ : isActive ? <button style={{ cursor: 'pointer' }} onClick={() => (connector?.deactivate ?? connector.actions.resetState)()}>Disconnect</button>
        /* ACTIVATING  */ : isActivating ? <button disabled>Activating ⏳</button>
        /* INTERACTING */ : interacting ? <button disabled>Prompted ⏳</button>
        /* CONNECT     */ : <button style={{ cursor: 'pointer' }} onClick={connect}>Connect</button>
      }
    </div>
  )

}
