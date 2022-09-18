import type { NextPage } from 'next'
import { useCallback, useState } from 'react'
import { ContractInstances, useContracts } from 'src/hooks/useContracts'
import styles from '../styles/Create.module.css'

import { PinataPinResponse } from '@pinata/sdk'
import { ethers } from 'ethers'
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import { ActionButton, ButtonInput, H3, TagInput, TextArea } from 'src/components'
import useShallowState from 'src/hooks/useShallowState'
import Image from 'next/image'

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

  const handleMessageChange = (value: string) => {
    resetState()
    setMessage(value)
  }

  const handleIpfsChange = (value: string) => {
    resetState()
    setIPFSHash(value)
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>

        <H3>tell us something</H3>
        <TextArea onChange={handleMessageChange} />

        <H3>tags</H3>
        <div style={{ display: 'flex' }}>
          <TagInput /><TagInput /><TagInput /><TagInput />
        </div>

        <H3>pay</H3>
        <ButtonInput />

        <H3>submit</H3>
        <ActionButton text='whistleblow' />

        <H3>Simulate Relayer</H3>
        <ActionButton text='publish' />
        {state.isPublished && 'Published!'}

      </main>
      <aside>
        <img src="/images/flysuck.jpg" />
      </aside>
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
