import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ConnectorProvider from 'src/web3/ConnectorProvider'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Whistleblower</title>
      </Head>
      <ConnectorProvider>
        <Component {...pageProps} />
      </ConnectorProvider>
    </>
  )
}

export default MyApp
