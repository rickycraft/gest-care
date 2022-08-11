import { FormEvent } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function FormLogin({
  errorMessage,
  onSubmit,
}: {
  errorMessage: string
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}) {
  return (
<Form onSubmit={onSubmit}>
    <Form.Group className="mb-3" controlId="username">
    <Form.Label>Username</Form.Label>
    <Form.Control  type="username" placeholder="Enter username" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="password">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" placeholder="Password" />
    <Form.Text className="text-muted">
    Your password must be minimum 8 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji. 
    </Form.Text>
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicCheckbox">
    <Form.Check type="checkbox" label="Remember me" />
  </Form.Group>
  <Button variant="primary" type="submit">
    Submit
  </Button>

  <div className="alert alert-danger" role="alert" hidden={errorMessage.length === 0}>
  {errorMessage}
</div>
  </Form>

  )
}
