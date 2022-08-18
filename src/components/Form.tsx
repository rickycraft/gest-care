import { useEffect, useState } from 'react';
import { FormEvent } from 'react'
import { Alert, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaUserCircle , FaKey} from "react-icons/fa";

const USER_REGEX = /^[A-z][A-z0-9-]{3,23}$/;
// const PWD_REGEX : RegExp= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/;
const PWD_REGEX_TEST : RegExp= /(?=.*[a-z])/;
const EMAIL_REGEX = /^[a-zA-Z0-9.! #$%&'*+/=? ^`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/;
export default function FormLogin({
  errorMessage,
  onSubmit,
}: {
  errorMessage: string
  isPasswordInvalid: boolean
  isUsernameInvalid: boolean
  onSubmit: (e: FormEvent<HTMLFormElement>) => void,
  children: React.ReactNode; // 👈️ added type for children
}) {
  
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [isUsernameInvalid, setIsUsernameInvalid] = useState(false);
  const [usernameValue, setUsernameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  useEffect(() => {
    //check regexp password
    if (USER_REGEX.test(usernameValue)) {
      setIsUsernameInvalid(false)
    } else {
      setIsUsernameInvalid(true)
    }
  }, [usernameValue]);

  useEffect (() =>{
    //check regexp password
    if (PWD_REGEX_TEST.test(passwordValue)) {
      setIsPasswordInvalid(false)
    } else {
      setIsPasswordInvalid(true)
    }
  }, [ passwordValue]);

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Username</Form.Label>
        <InputGroup hasValidation>
          <InputGroup.Text id="inputGroupPrepend"><FaUserCircle/></InputGroup.Text>
          <Form.Control type="text" required isInvalid={isUsernameInvalid} placeholder="Enter username" value={usernameValue}
          onChange={(event) => { setUsernameValue(event?.currentTarget.value)}} />
          <Form.Control.Feedback type="invalid" >
            Please choose a real username
          </Form.Control.Feedback>
        </InputGroup >
      </Form.Group>
      <Form.Group className="mb-3" controlId="password" >
        <Form.Label>Password</Form.Label>
        <InputGroup hasValidation >
          <InputGroup.Text id="inputGroupPrepend"><FaKey/></InputGroup.Text>
          <Form.Control type="password" required isInvalid={isPasswordInvalid} placeholder="Enter Password" 
          onChange={(event) => { setPasswordValue(event?.currentTarget.value)}}/>
          <Form.Control.Feedback type="invalid" >
            Your password must be minimum 8 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
          </Form.Control.Feedback>
        </InputGroup >
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox" >
        <Form.Check type="checkbox" label="Remember me" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>

      <Alert variant='danger' hidden={errorMessage.length === 0}>
        {errorMessage}
      </Alert>
      
    </Form>
    

  )
}
