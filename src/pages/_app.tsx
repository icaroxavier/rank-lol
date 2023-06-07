import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import { QueryClientProvider, QueryClient } from 'react-query'

import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'

const queryClient = new QueryClient()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ToastContainer />
    </QueryClientProvider>
  )
}
