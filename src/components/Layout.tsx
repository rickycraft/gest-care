import Header from './Header'
import { useState, useEffect } from 'react'
import React from 'react'
import { useRef } from 'react'

export const TooltipContext = React.createContext(null)

export default function Layout({ children }: { children: React.ReactNode }) {
  const [pageLoaded, setPageLoaded] = useState(false)
  useEffect(() => setPageLoaded(true), [])

  const tooltipContainer = useRef(null)

  return (
    <div ref={tooltipContainer}>
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
          --bs-bg-opacity: 1;
          background-color: rgba(var(--bs-light-rgb), var(--bs-bg-opacity)) !important;
          height: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'Helvetica Neue', Arial, Noto Sans, sans-serif, 'Apple Color Emoji',
            'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        }

      `}</style>
      {pageLoaded && <Header />}

      <main>
        <TooltipContext.Provider value={tooltipContainer.current}>
          <div className='p-2 p-md-4'>{children}</div>
        </TooltipContext.Provider>
      </main>
    </div>
  )
}
