import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { FunctionComponent } from 'react'

const App: FunctionComponent<AppProps> = ({
  Component, 
  pageProps: {
    session,
    ...pageProps
  }
}) => (
  <SessionProvider session={session}>
    <Component {...pageProps} />
  </SessionProvider>
)

export default App