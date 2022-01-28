import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { FunctionComponent } from 'react'

import '../styles/globals.css'

const App: FunctionComponent<AppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <SessionProvider session={session}>
    <Component {...pageProps} />
  </SessionProvider>
)

export default App
