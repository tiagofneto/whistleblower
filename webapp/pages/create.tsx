import type { NextPage } from 'next'
import { useCallback } from 'react'
import { ContractInstances, useContracts } from 'src/hooks/useContracts'
import styles from '../styles/Create.module.css'

import { PinataPinResponse } from '@pinata/sdk'
import { ethers } from 'ethers'
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import { ActionButton, ButtonInput, H3, Input, MetaMaskCard, TagInput, TextArea } from 'src/components'
import useShallowState from 'src/hooks/useShallowState'

export interface FormState {
  text: string
  ipfsLink: string
  tag1: string
  tag2: string
  tag3: string
  tag4: string
  pay: string
}

const Home: NextPage = () => {
  const { contracts } = useContracts()

  const [state, setState, { resetState }, refState] = useShallowState({
    // Message
    isSubmitting: false,
    isSubmitted: false,
    // Pinata result
    ipfsLink: '', // 'ipfs://0xabc123'
    // Relayer
    isPublishing: false,
    isPublished: false,
  })

  const [form, setForm, { resetState: resetForm }, refform] = useShallowState({
    text: '',
    ipfsLink: '',
    tag1: '',
    tag2: '',
    tag3: '',
    tag4: '',
    pay: '0.01',
  })

  const isUsingIPFSInput = !!form.ipfsLink.length

  const submit = useCallback(async () => {
    setState({ isSubmitting: true })
    let ipfsLink
    if (isUsingIPFSInput) {
      ipfsLink = form.ipfsLink
    } else {
      const ipfsHash = await uploadToPinata(refform.current)
      ipfsLink = `ipfs://${ipfsHash}`
      console.debug('{ipfsHash, ipfsLink}', { ipfsHash, ipfsLink })
    }
    console.debug('ipfsLink', ipfsLink)
    setState({ ipfsLink })

    await submitIPFSLinkToRelayers(ipfsLink, contracts)
    setState({
      isSubmitting: false,
      isSubmitted: true,
    })
  }, [setState, isUsingIPFSInput, form.ipfsLink, refform, contracts])

  const submitToBlockchainAsRelayer = useCallback(async () => {
    setState({ isPublishing: true })
    const ipfsLink = refState.current.ipfsLink
    await (await contracts.Lens.functions.verifyAndPost(ipfsLink)).wait()
    resetState()
    setState({ isPublished: true })
  }
    , [contracts, refState, resetState, setState]
  )

  const handleMessageChange = (text: string) => {
    resetState()
    setForm({ text })
  }

  const handleIpfsChange = (ipfsLink: string) => {
    resetState()
    setForm({ ipfsLink })
  }

  return (
    <>
      <div className={styles.container}>
        <main className={styles.main}>

          <H3>tell us something</H3>
          <TextArea value={form.text} onChange={handleMessageChange} disabled={isUsingIPFSInput || state.isSubmitted || state.isSubmitting} />

          <H3>or provide ipfs link instead</H3>
          <Input value={form.ipfsLink} onChange={handleIpfsChange} disabled={state.isSubmitted || state.isSubmitting} />

          <H3>tags</H3>
          <div style={{ display: 'flex' }}>
            <TagInput value={form.tag1} onChange={tag1 => setForm({ tag1 })} />
            <TagInput value={form.tag2} onChange={tag2 => setForm({ tag2 })} />
            <TagInput value={form.tag3} onChange={tag3 => setForm({ tag3 })} />
            <TagInput value={form.tag4} onChange={tag4 => setForm({ tag4 })} />
          </div>

          <H3>pay</H3>
          <ButtonInput value={form.pay} />

          <H3>submit</H3>
          <ActionButton text='whistleblow' onClick={submit} disabled={!(form.text.length || form.ipfsLink.length) || state.isSubmitted || state.isSubmitting} />

          <H3>Simulate Relayer</H3>
          <ActionButton text='publish' onClick={submitToBlockchainAsRelayer} disabled={!state.isSubmitted || state.isPublishing} />
          {state.isPublished && 'Published!'}

        </main>
        <aside>
          <img src="/images/flysuck.jpg" />
        </aside>
      </div>

      <MetaMaskCard />
    </>
  )
}

export default Home

const uploadToPinata = async (form: FormState) =>
  fetch('/api/pinata', {
    method: 'POST',
    body: JSON.stringify(form),
  }).then<PinataPinResponse>(r => r.json())
    .then(r => r.IpfsHash)

const submitIPFSLinkToRelayers = async (ipfsLink: string, contractsHook: ContractInstances) => {
  const ipfsLinkHash = keccak256(toUtf8Bytes(ipfsLink))
  const fee = ethers.BigNumber.from('10').pow(16)
  console.debug('submit to relayers', {
    ipfsLink,
    ipfsLinkHash,
    fee,
    contractsHook,
  })
  const tx = await contractsHook.Pool.functions.deposit(ipfsLinkHash, { value: fee })
  await tx.wait()
}
