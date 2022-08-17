import { useRouter } from 'next/router'
import React, { useState } from 'react'
import LoginForm from 'components/LoginForm'

export default function Login() {
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  return (
    <div className="login">
      <LoginForm
        errorMessage={errorMsg}
        onSubmit={async (event) => {
          event.preventDefault()
          const body = {
            username: event.currentTarget.username.value,
            password: event.currentTarget.password.value
          }
          try {
            // console.log('[DBG LOGIN] body: '+body.username+' '  + body.password)
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            })
            if (response.ok) {
              const json = await response.json()
              const loggedIn = json['isLoggedIn']
              if (!loggedIn) setErrorMsg("Wrong username or password!")
              else router.push('/')
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
