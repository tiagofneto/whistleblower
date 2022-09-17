import type { NextPage } from 'next'
import { useState } from 'react'
import MetaMaskCard from 'src/components/organizms/MetaMaskCard'
import { useContracts } from 'src/hooks/useContracts'
import styles from '../styles/Home.module.css'

import { keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import { ethers } from 'ethers'
import { H2, H3 } from 'src/components'

const Home: NextPage = () => {
  const { contracts } = useContracts()

  const [text, setText] = useState('')
  const [link, setLink] = useState('')

  const isLinkSet = !!link.length

  const handleClick = async () => {
    if (isLinkSet) {
      submitIPFSHash(link)
    } else {
      await fetch('/api/pinata', {
        method: 'POST',
        body: text,
      }).then(r => r.json())
        .then(submitIPFSHash)
    }
  }


  const submitIPFSHash = async (ipfshash: string) => {
    const ipfsLink = `ipfs://${ipfshash}`
    const ipfsLinkHash = keccak256(toUtf8Bytes(ipfsLink))
    const fee = ethers.BigNumber.from('10').pow(16)
    console.debug('WILL SEND: ', {
      ipfsLink,
      ipfsLinkHash,
      fee,
    })
    contracts.Pool.functions.deposit(ipfsLinkHash, { value: fee })
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Create new Message
        </h1>

        <MetaMaskCard />

        <H2>Message</H2>
        message:
        <textarea disabled={isLinkSet} value={text} onChange={ev => setText(ev.currentTarget.value)}></textarea>
        ipfsLink:
        <input type='text' value={link} onChange={ev => setLink(ev.currentTarget.value)} />
        <H3>Submit</H3>
        <button disabled={!text.length} onClick={handleClick}>Submit {isLinkSet ? 'IPFS Link' : 'Message'}</button>

      </main>
    </div>
  )
}

export default Home
