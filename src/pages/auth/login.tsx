import { useAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Spinner } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { FaKey, FaUserCircle } from "react-icons/fa"
import { userAtom } from 'utils/atom'

const ErrorMessage = dynamic(() => import('components/utils/ErrorMessage'), { ssr: false })

export default function Login() {
  const [errorMsg, setErrorMsg] = useState('')
  const [, setUserAtom] = useAtom(userAtom)
  const [isLoading, setLoading] = useState(false)

  const submit = (username: string, password: string) => {
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(res => res.json())
      .then(result => {
        setUserAtom(result)
        window.location.href = window.location.origin + '/preventivo/list'
      }).catch(() => setErrorMsg('Username o Passoword errati'))
      .finally(() => setLoading(false))
  }

  return (
    <div className='d-flex justify-content-center' style={{ height: "70vh" }}>
      <Form onSubmit={(e) => {
        setLoading(true)
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
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? <Spinner animation='border' /> : 'Accedi'}
          </Button>
          <ErrorMessage message={errorMsg} />
        </Card>
      </Form>
    </div>
  )
}
