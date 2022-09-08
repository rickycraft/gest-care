import { useEffect, useState } from 'react'
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap'
import { INVALID_ID } from 'utils/constants'
import { trpc } from 'utils/trpc'

export default function User() {

  const [role, setRole] = useState('user')
  const [showSuccess, setShowSuccess] = useState(false)
  const [username, setUsername] = useState('')
  const [userId, setUserId] = useState(INVALID_ID)
  const [isUserManual, setUserManual] = useState(false)
  const userQuery = trpc.useQuery(['auth.listUser'])
  const userMutate = trpc.useMutation('auth.editUser', {
    onSuccess: () => {
      userQuery.refetch()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    },
  })

  useEffect(() => {
    if (!userQuery.data) return
    const user = userQuery.data.find((user) => user.id === userId)
    if (!user) return
    setRole(user.role)
  }, [userId])

  if (!userQuery.isSuccess) return <Spinner animation="border" />

  return (
    <Card body className='col-md-6 m-auto'>
      <Card.Title>Modifica parametri utente</Card.Title>
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          const target = e.target as any
          const password = target.password.value as string
          const _username = (isUserManual) ? username : (userQuery.data.find(u => u.id == userId)?.username)
          if (_username === undefined) return
          userMutate.mutate({ username: _username, password, role })
          target.reset()
          setUserId(INVALID_ID)
          setUsername('')
        }}>
        <Form.Group onDoubleClick={() => setUserManual(!isUserManual)}>
          <Form.Label>Username</Form.Label>
          {isUserManual ? (
            <Form.Control type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          ) : (
            <Form.Select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
              <option value={INVALID_ID}>Seleziona un utente</option>
              {userQuery.data.map(({ id, username }) => (
                <option key={id} value={id}>{username}</option>
              ))}
            </Form.Select>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name='password' />
        </Form.Group>
        <Form.Group>
          <Form.Label>Ruolo</Form.Label>
          <Form.Control type="text" placeholder="user" name='role' value={role} onChange={(e) => setRole(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit" className='mt-3'>
          {(userMutate.isLoading) ? <Spinner animation='border' /> : "Conferma"}
        </Button>
      </Form>
      <Alert variant='success' hidden={!showSuccess} className='mt-3'>
        Parametri utente modificati con successo
      </Alert>
    </Card>
  )
}