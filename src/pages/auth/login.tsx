import { useAtom } from 'jotai'
import { userAtom } from 'utils/atom'
import { z } from 'zod'
import { useState } from 'react'
import { Card, InputGroup } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { FaUserCircle, FaKey } from "react-icons/fa"
import ErrorMessage from 'components/utils/ErrorMessage'
import { H } from 'highlight.run'

const loginResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  role: z.string(),
  isLoggedIn: z.boolean(),
})

export default function Login() {
  const [errorMsg, setErrorMsg] = useState('')
  const [, setUserAtom] = useAtom(userAtom)

  const submit = (username: string, password: string) => {
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(res => res.json())
      .then(res => {
        const result = loginResponseSchema.safeParse(res)
        if (!result.success) {
          setErrorMsg('Login response malformed')
          return
        }
        H.identify(result.data.username, result.data)
        setUserAtom(result.data)
        window.location.href = window.location.origin + '/preventivo/list'
      }).catch(() => setErrorMsg('Username o Passoword errati'))
  }

  return (
    <div className='d-flex justify-content-center' style={{ height: "70vh" }}>
      <Form onSubmit={(e) => {
        e.preventDefault()
        const elements = (e.target as HTMLFormElement).elements
        const username = elements.namedItem('username') as HTMLInputElement
        const password = elements.namedItem('password') as HTMLInputElement
        submit(username.value, password.value)
      }} className='d-flex flex-column justify-content-center col-md-6'>
        <Card body>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend"><FaUserCircle /></InputGroup.Text>
              <Form.Control type="text" required placeholder="Inserisci l'username" />
              <Form.Control.Feedback type="invalid" >
                Please choose a real username
              </Form.Control.Feedback>
            </InputGroup >
          </Form.Group>
          <Form.Group className="mb-3" controlId="password" >
            <Form.Label>Password</Form.Label>
            <InputGroup hasValidation >
              <InputGroup.Text id="inputGroupPrepend"><FaKey /></InputGroup.Text>
              <Form.Control type="password" required placeholder="Inserisci la passowrd" />
              <Form.Control.Feedback type="invalid" >
                Your password must be minimum 8 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
              </Form.Control.Feedback>
            </InputGroup >
          </Form.Group>
          <Button variant="primary" type="submit">Accedi</Button>
          <ErrorMessage message={errorMsg} />
        </Card>
      </Form>
    </div>
  )
}
