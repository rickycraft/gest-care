import { useRouter } from 'next/router'
import React, { useState } from 'react'
import LoginForm from 'components/LoginForm'
import { useAtom } from 'jotai'
import { userAtom } from 'utils/atom'
import { z } from 'zod'

const loginResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  role: z.string(),
  isLoggedIn: z.boolean(),
})

export default function Login() {
  const [errorMsg, setErrorMsg] = useState('')
  const [, setUserAtom] = useAtom(userAtom)

  return (
    <div className="login">
      <LoginForm
        errorMessage={errorMsg}
        onSubmit={async (username, password) => {
          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password }),
            })
            if (response.ok) {
              const result = loginResponseSchema.safeParse(await response.json())
              if (!result.success) {
                setErrorMsg('Login response malformed')
                return
              }
              if (!result.data.isLoggedIn) {
                setErrorMsg("Wrong username or password!")
                return
              }
              setUserAtom(result.data)
              window.location.replace(window.location.origin)
            } else {
              setErrorMsg('Server error')
            }
          } catch (error) {
            setErrorMsg('An unexpected error happened')
          }
        }}
      />
    </div>
  )
}
