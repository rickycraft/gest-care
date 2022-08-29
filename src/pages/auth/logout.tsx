import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { defaultUserAtom, userAtom } from 'utils/atom'

export default function Logout() {
  const [, setUserAtom] = useAtom(userAtom)

  useEffect(() => {
    setUserAtom(defaultUserAtom)
    fetch('/api/auth/logout').then(() => {
      window.location.href = window.location.origin.concat('/auth/login')
    })
  }, [])

  return <div></div>
}