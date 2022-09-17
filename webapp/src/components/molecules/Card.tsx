import { Web3ReactHooks } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Accounts, ConnectButton, Status } from 'src/components/atoms'
import { getName } from 'src/web3/utils'
import styles from '/styles/Home.module.css'
import useToggle from '../../hooks/useToggle'

interface Props {
  connector: MetaMask //| WalletConnect | CoinbaseWallet | Network | GnosisSafe
  chainId: ReturnType<Web3ReactHooks['useChainId']>
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
  isActive: ReturnType<Web3ReactHooks['useIsActive']>
  error: Error | undefined
  setError: (error: Error | undefined) => void
  interactingState: ReturnType<typeof useToggle>
  ENSNames: ReturnType<Web3ReactHooks['useENSNames']>
  provider?: ReturnType<Web3ReactHooks['useProvider']>
  accounts?: string[]
}

export function Card({
  connector,
  chainId,
  isActivating,
  isActive,
  error,
  setError,
  interactingState,
  ENSNames,
  accounts,
  provider,
}: Props) {
  return (
    <div
      className={styles.card}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '20rem',
      }}
    >
      <h2>{getName(connector)} ⤵</h2>

      <div style={{ marginBottom: '1rem' }}>
        <Status isInteracting={interactingState[0]} isActivating={isActivating} isActive={isActive} error={error} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <Accounts accounts={accounts} provider={provider} ENSNames={ENSNames} />
      </div>
      <ConnectButton
        connector={connector}
        chainId={chainId}
        isActivating={isActivating}
        isActive={isActive}
        error={error}
        setError={setError}
        interactingState={interactingState}
      />
    </div>
  )
}
