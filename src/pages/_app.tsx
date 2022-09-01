// trpc
import { withTRPC } from '@trpc/next'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import superjson from 'superjson'
// bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import SSRProvider from 'react-bootstrap/SSRProvider'
// google analytics
import { GoogleAnalytics } from 'nextjs-google-analytics'
// next
import type { AppProps } from 'next/app'
import { AppRouter } from 'server/routers/_app'
import Head from 'next/head'
import { useEffect } from 'react'
import Layout from 'components/Layout'

// dynamic(() => require('bootstrap/dist/js/bootstrap'), { ssr: false })

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    import('../components/utils/Highlight').then(h => h.setup())
  }, [])

  return (
    <>
      <GoogleAnalytics trackPageViews strategy="lazyOnload" />
      <SSRProvider>
        <Layout>
          <Head>
            <title>Gest Care</title>
            <link rel="icon" href="/favicon.ico" />
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
          url: '/api/trpc',
          maxBatchSize: 10,
        }),
      ],
      transformer: superjson,
    }
  },
  ssr: false,
})(MyApp)
