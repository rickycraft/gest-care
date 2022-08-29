import Header from './Header'
import { useState, useEffect } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [pageLoaded, setPageLoaded] = useState(false)
  useEffect(() => setPageLoaded(true), [])

  return (
    <>
      <style jsx global>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        #__next {
          height: 100%;
        }

        html {
          height: 100%;
        }

        body {
          margin: 0;
          height: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'Helvetica Neue', Arial, Noto Sans, sans-serif, 'Apple Color Emoji',
            'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        }

      `}</style>
      {pageLoaded && <Header />}

      <main className='h-100 bg-light'>
        <div className='p-4 h-100'>{children}</div>
      </main>

      {/* <div className="fixed-bottom">
        <Footer></Footer>
      </div> */}

    </>
  )
}
