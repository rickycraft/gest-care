import React, { useState } from 'react'
import useUser from '../lib/useUser'
import Layout from '../components/Layout'
import Form from '../components/Form'
import fetchJson, { FetchError } from '../lib/fetchJson'


export default function Login() {
  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser({
    redirectTo: '/', //se l'utente riesce a loggarsi, allora viene rediretto all'index
    redirectIfFound: true,
  })

  //useState inizializza lo stato errorMsg a messaggio vuoto e utilizza come setState, il setErrorMsg
  // quindi per modificare errorMsg bisogna chiamare setErrorMsg
  const [errorMsg, setErrorMsg] = useState('') 

  return (
    <Layout>
      <div className="login">
        <Form
          errorMessage={errorMsg}
          onSubmit={async function handleSubmit(event) {
            event.preventDefault()

            const body = {
              username: event.currentTarget.username.value,
              password: event.currentTarget.password.value
            }

            try {
              // console.log('[DBG LOGIN] body: '+body.username+' '  + body.password)

              mutateUser(
                await fetchJson('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body),
                })
              )
            } catch (error) {
              if (error instanceof FetchError) {
                setErrorMsg(error.data.message)
              } else {
                console.error('An unexpected error happened:', error)
              }
            }
          }}
        />
      </div>
      <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </Layout>
  )
}

