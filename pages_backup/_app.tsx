import PlausibleProvider from 'next-plausible'
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain={process.env.NEXT_PUBLIC_PUBLIC_URL || process.env.PLAUSIBLE_DOMAIN || ''}>
      <Component {...pageProps} />
    </PlausibleProvider>
  )
}
