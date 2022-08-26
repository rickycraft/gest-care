import { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'

const defaultTimeout = 5000

export default function ErrorMessage({
  message,
  timeout = defaultTimeout,
}: {
  message: string,
  timeout?: number,
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (message == '') return
    setShow(true)
    setTimeout(() => setShow(false), timeout)
  }, [message])

  return (
    <Alert variant='danger' hidden={!show} className='mt-3'>
      {message}
    </Alert>
  )
}