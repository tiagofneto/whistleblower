import { useEffect, useState } from 'react'
import { metaMaskHooks, metaMaskConnector } from 'src/web3/connectors/metaMask'
import { Card } from 'src/components/molecules'
import useToggle from 'src/hooks/useToggle'

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = metaMaskHooks

export default function MetaMaskCard() {
  const chainId = useChainId()
  const accounts = useAccounts()
  const isActivating = useIsActivating()

  const isActive = useIsActive()

  const provider = useProvider()
  const ENSNames = useENSNames(provider)

  const [error, setError] = useState(undefined as Error | undefined)
  const interactingState = useToggle(false)

  // attempt to connect eagerly on mount
  useEffect(() => {
    void metaMaskConnector.connectEagerly().catch(() => {
      console.info('Failed to connect eagerly to metamask')
    })
  }, [])

  return (
    <Card
      connector={metaMaskConnector}
      chainId={chainId}
      isActivating={isActivating}
      isActive={isActive}
      error={error}
      setError={setError}
      interactingState={interactingState}
      accounts={accounts}
      provider={provider}
      ENSNames={ENSNames}
    />
  )
}
