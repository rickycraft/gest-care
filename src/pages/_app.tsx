// trpc
import { withTRPC } from '@trpc/next'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import superjson from 'superjson'
// bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import SSRProvider from 'react-bootstrap/SSRProvider'
// highlight
import { H } from 'highlight.run'
import '@highlight-run/react/dist/highlight.css'
// google analytics
import { GoogleAnalytics } from 'nextjs-google-analytics'
// next
import type { AppProps } from 'next/app'
import { AppRouter } from 'server/routers/_app'
import Head from 'next/head'
import { useEffect } from 'react'
import Layout from 'components/Layout'

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_H_KEY != undefined) {
      H.init(process.env.NEXT_PUBLIC_H_KEY, {
        disableConsoleRecording: true,
        networkRecording: false,
        environment: process.env.NODE_ENV,
      })
    }

    typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null
  }, [])

  return (
    <>
      <GoogleAnalytics trackPageViews strategy="lazyOnload" />
      <SSRProvider>
        <Layout>
          <Head>
            <meta name="robots" content="noindex" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Head>
          <Component {...pageProps} />
        </Layout>
      </SSRProvider>
    </>
  )
}

export default withTRPC<AppRouter>({
  config() {
    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 2 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
          }
        }
      },
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) => process.env.NODE_ENV === 'development'
        }),
        httpBatchLink({
          url: 'getBaseUrl()}/api/trpc',
          maxBatchSize: 10,
        }),
      ],
      transformer: superjson,
    }
  },
  ssr: false,
})(MyApp)
