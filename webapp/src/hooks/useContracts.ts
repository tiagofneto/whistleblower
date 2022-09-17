import contractAddresses from 'src/contractAddresses'
import { useMemo } from 'react'
import { factories } from '_typings' // Did you forget to run `npm run typechain:compile`?
import { metaMaskHooks } from 'src/web3/connectors/metaMask'

/**
 * @author Qwerty <qwerty@qwerty.xyz>
 *
 * Simply call methods on contracts.
 *
 * @example
 * const contracts = useContracts()
 * const result = await contracts.exampleABI.functions.lastGoodPrice(contracts.mockETH.address)
 *
 * // When you get an error, you can always instantiate a contract manually.
 *
 * @example
 * const { provider } = useWeb3React()
 * const exampleABI = ExampleABI__factory.connect(contracts.exampleABI.address, provider.getSigner())
 * await exampleABI.functions.lastGoodPrice(contracts.mockETH.address)
 */

export function useContracts(): {
  contracts: ContractInstances
  addresses: ContractAddresses
  } {

  const provider = metaMaskHooks.useProvider()!

  return useMemo(() => {

    const addresses = new Proxy({}, {
      get(_, prop: ContractAddressesKeys) {
        if (!(prop in contractAddresses)) throw `Blockchain address mising for: ${prop}`
        return contractAddresses[prop].address
      },
    }) as ContractAddresses

    const contracts = new Proxy({/* contract instances cache */ }, {
      get(cache: Partial<ContractInstances>, prop: ContractAddressesKeys, receiver: ContractInstances) {
        if (prop in cache) return cache[prop] // eslint-disable-line @typescript-eslint/no-unsafe-return

        const name = prop.replace(/./, x => x.toUpperCase()) as ContractNames
        if (factories[`${name}__factory`] === undefined) throw `ABI is missing for contracts.${name}. Did you mean to use addresses.${name} instead?`

        return cache[prop] = factories[`${name}__factory`].connect(addresses[prop], provider?.getSigner())
      },
    }) as ContractInstances

    return { contracts, addresses }
  },
  [provider]
  )
}

type ContractAddressesKeys = keyof typeof contractAddresses
type ContractNames = keyof typeof factories extends `${infer A}__factory` ? A : never
type ContractInstances = {
  // @ts-expect-error This gives error when some of abi/* or contractAddresses/* is missing. e.g. 'mockETH'.
  [contract in ContractAddressesKeys]: ReturnType<typeof factories[`${Capitalize<contract>}__factory`]['connect']>
}
type ContractAddresses = {
  [contract in ContractAddressesKeys]: string
}
