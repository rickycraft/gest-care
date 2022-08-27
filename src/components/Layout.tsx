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

        body {
          margin: 0;
          color: #333;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'Helvetica Neue', Arial, Noto Sans, sans-serif, 'Apple Color Emoji',
            'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        }
      `}</style>
      {pageLoaded && <Header />}

      <main>
        <div className='p-4'>{children}</div>
      </main>

      {/* <div className="fixed-bottom">
        <Footer></Footer>
      </div> */}

    </>
  )
}
