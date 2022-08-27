import { useEffect, useMemo, useState } from 'react'
import { FormEvent } from 'react'
import { InputGroup } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { FaUserCircle, FaKey } from "react-icons/fa"
import ErrorMessage from './utils/ErrorMessage'

const USER_REGEX = /^[A-z][A-z0-9-]{3,20}$/
const PWD_REGEX_TEST = /\S{10,20}/

export default function LoginForm({
  errorMessage,
  onSubmit,
}: {
  errorMessage: string
  onSubmit: (user: string, password: string) => Promise<void>
}) {
  const [usernameValue, setUsernameValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const usernameValid = useMemo(() => USER_REGEX.test(usernameValue), [usernameValue])
  const passwordValid = useMemo(() => PWD_REGEX_TEST.test(passwordValue), [passwordValue])

  return (
    <Form onSubmit={async () => {
      await onSubmit(usernameValue, passwordValue)
      setUsernameValue('')
      setPasswordValue('')
    }}>
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Username</Form.Label>
        <InputGroup hasValidation>
          <InputGroup.Text id="inputGroupPrepend"><FaUserCircle /></InputGroup.Text>
          <Form.Control type="text" required isInvalid={!usernameValid} placeholder="Enter username" value={usernameValue}
            onChange={(event) => setUsernameValue(event.currentTarget.value)} />
          <Form.Control.Feedback type="invalid" >
            Please choose a real username
          </Form.Control.Feedback>
        </InputGroup >
      </Form.Group>
      <Form.Group className="mb-3" controlId="password" >
        <Form.Label>Password</Form.Label>
        <InputGroup hasValidation >
          <InputGroup.Text id="inputGroupPrepend"><FaKey /></InputGroup.Text>
          <Form.Control type="password" required isInvalid={!passwordValid} placeholder="Enter Password" value={passwordValue}
            onChange={(event) => setPasswordValue(event.currentTarget.value)} />
          <Form.Control.Feedback type="invalid" >
            Your password must be minimum 8 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
          </Form.Control.Feedback>
        </InputGroup >
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>

      <ErrorMessage message={errorMessage} />

    </Form>


  )
}
