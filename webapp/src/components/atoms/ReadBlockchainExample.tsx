import { ethers } from 'ethers'
import React, { useState } from 'react'
import { useContracts } from 'src/hooks/useContracts'
import { metaMaskHooks } from 'src/web3/connectors/metaMask'
import styles from '/styles/Home.module.css'


const ReadBlockchainExample: React.FC = () => {
  const contracts = useContracts()
  const account = metaMaskHooks.useAccount()!

  const [balance, setBalance] = useState('')

  function getBalance() {
    contracts.contracts.ethereum.balanceOf(account)
      .then(v => ethers.BigNumber.from(v).toString())
      .then(setBalance)
      .catch(() => setBalance('Only Rinkeby'))
  }

  return (
    <div className={styles.card}>
      <h2>Query blockchain ⤵</h2>
      <button style={{ cursor: 'pointer' }} onClick={getBalance}>
        Get balance
      </button>
      {' ' + balance}
    </div>
  )
}

export default ReadBlockchainExample
