import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ConnectorProvider from 'src/web3/ConnectorProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConnectorProvider>
      <Component {...pageProps} />
    </ConnectorProvider>
  )
}

export default MyApp
