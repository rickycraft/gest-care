import { useRouter } from 'next/router'
import { useEffect } from 'react'


export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('preventivo/list')
  }, [])

  return (
    <div className="container">
      <main>
        <h1>Index page</h1>
      </main>
    </div>
  )
}
