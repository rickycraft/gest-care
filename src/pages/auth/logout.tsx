import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { defaultUserAtom, userAtom } from 'utils/atom'

export default function Logout() {
  const router = useRouter()
  const [, setUserAtom] = useAtom(userAtom)

  useEffect(() => {
    setUserAtom(defaultUserAtom)
    fetch('/api/auth/logout').then(() => {
      window.location.replace(window.location.origin.concat('/auth/login'))
    })
  }, [])

  return (
    <h1 className='text-center'>
      Logging out
    </h1>
  )
}