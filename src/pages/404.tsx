import { useState } from 'react'

const DEFAULT_MESSAGE = 'PAGINA NON TROVATA'

export default function Custom404() {

  const [message, setMessage] = useState(DEFAULT_MESSAGE)

  return (
    <div className='d-flex flex-fill justify-content-center align-items-center' style={{ minHeight: "100vh" }}>
      <h1 className='bg-warning p-4 rounded-pill'
        onClick={() => window.location.href = '/'}
        onMouseEnter={() => setMessage('TORNA ALLA HOME')}
        onMouseLeave={() => setMessage(DEFAULT_MESSAGE)}
      >
        {message}
      </h1>
    </div>
  )
}