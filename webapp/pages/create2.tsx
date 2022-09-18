import type { NextPage } from 'next'
import { ChangeEvent, useCallback, useState } from 'react'
import MetaMaskCard from 'src/components/organisms/MetaMaskCard'
import { ContractInstances, useContracts } from 'src/hooks/useContracts'
import styles from '../styles/Home.module.css'

import { keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import { ethers } from 'ethers'
import { H2, H3 } from 'src/components'
import { PinataPinResponse } from '@pinata/sdk'
import useShallowState from 'src/hooks/useShallowState'

const Home: NextPage = () => {
  const { contracts } = useContracts()

  const [state, setState, { resetState }, refState] = useShallowState({
    // Message
    isSubmitting: false,
    isSubmitted: false,
    // Pinata result
    ipfsHash: '', // '0xabc123'
    ipfsLink: '', // 'ipfs://0xabc123'
    // Relayer
    isPublishing: false,
    isPublished: false,
  })

  const [inputMessage, setMessage] = useState('')
  const [inputIpfsHash, setIPFSHash] = useState('')

  const isUsingIPFSInput = !!inputIpfsHash.length

  const submit = useCallback(async () => {
    setState({ isSubmitting: true })
    const ipfsHash = isUsingIPFSInput
      ? inputIpfsHash
      : await uploadToPinata(inputMessage)
    const ipfsLink = `ipfs://${ipfsHash}`
    setState({ ipfsHash, ipfsLink })
    await submitIPFSHashToRelayers(ipfsHash, contracts)
    setState({
      isSubmitting: false,
      isSubmitted: true,
    })
  }, [contracts, inputIpfsHash, inputMessage, isUsingIPFSInput, setState])

  const submitToBlockchainAsRelayer = useCallback(async () => {
    setState({ isPublishing: true })
    const ipfsLink = `ipfs://${refState.current.ipfsHash}`
    await (await contracts.Lens.functions.verifyAndPost(ipfsLink)).wait()
    resetState()
    setState({ isPublished: true })
  }
    , [contracts, refState, resetState, setState]
  )

  const handleMessageChange = (ev: ChangeEvent<HTMLTextAreaElement>) => {
    resetState()
    setMessage(ev.currentTarget.value)
  }

  const handleIpfsChange = (ev: ChangeEvent<HTMLInputElement>) => {
    resetState()
    setIPFSHash(ev.currentTarget.value)
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Create new Message
        </h1>

        <MetaMaskCard />

        <H2>Create Message</H2>
        <p>Provide either a message or an ipfs link of an existing message.</p>

        message:
        <textarea disabled={isUsingIPFSInput || state.isSubmitted || state.isSubmitting} value={inputMessage} onChange={handleMessageChange}></textarea>
        ipfs hash:
        <input disabled={state.isSubmitted || state.isSubmitting} type='text' value={inputIpfsHash} onChange={handleIpfsChange} />
        <H3>Submit</H3>
        <button disabled={!inputMessage.length || state.isSubmitted || state.isSubmitting} onClick={submit}>Submit {isUsingIPFSInput ? 'IPFS Link' : 'Message'}</button>

        <H3>Simulate Relayer</H3>
        <button disabled={!state.isSubmitted || state.isPublishing} onClick={submitToBlockchainAsRelayer}>Publish on blockchain</button>
        {state.isPublished && 'Published!'}

      </main>
    </div>
  )
}

export default Home

const uploadToPinata = async (body: string) =>
  fetch('/api/pinata', {
    method: 'POST',
    body,
  }).then<PinataPinResponse>(r => r.json())
    .then(r => r.IpfsHash)

const submitIPFSHashToRelayers = async (ipfsHash: string, useContractsHook: ContractInstances) => {
  const ipfsLink = `ipfs://${ipfsHash}`
  const ipfsLinkHash = keccak256(toUtf8Bytes(ipfsLink))
  const fee = ethers.BigNumber.from('10').pow(16)
  const tx = await useContractsHook.Pool.functions.deposit(ipfsLinkHash, { value: fee })
  await tx.wait()
}
