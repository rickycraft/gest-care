import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Form from '../components/Form'
import { FetchError } from '../lib/fetchJson'
import { InferGetServerSidePropsType } from "next";
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from "server/iron"
import { IronSessionData } from 'iron-session';

//
export default function Login({ }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [user] = useState<IronSessionData>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()
  console.log('[DBG LOGIN] state of isLoggedIn: ' + isLoggedIn)

  useEffect(() => {
    // console.log('[DBG LOGIN] isLoggedIn: ' + isLoggedIn)
    if (isLoggedIn === true) {
      router.push('/')
    }
  }, [isLoggedIn, router]);


  useEffect(() => {
    console.log('[DBG LOGIN] user : ' + user)
  }, [user]);


  return (
    <div>
      <div className="login">
        <Form
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
                let json = await response.json();
                console.log('response json: ' + JSON.stringify(json));
                setIsLoggedIn(json.isLoggedIn);
                if (!json.isLoggedIn) {
                  setErrorMsg("Wrong username or password!")
                }
              }
            } catch (error) {
              if (error instanceof FetchError) {
                setErrorMsg(error.data.message)
              } else {
                console.error('An unexpected error happened:', error)
              }
            }
          }}
        >
        </Form>
      </div>
      <br />
      Source: <a href="https://github.com/rickycraft/gest-care">GitHub Repo</a>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;
  console.log('session: ' + user);
  if (user === undefined || user.isLoggedIn === false) {
    return {
      props: {
        user: { id: -1, username: '', isLoggedIn: false }, //ATT debole ma da modificare
      },
    };
  }

  return {
    props: { user: req.session.user },
  };
},
  sessionOptions);
