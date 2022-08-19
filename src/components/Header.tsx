import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { useRouter } from 'next/router'
import { trpc } from 'utils/trpc'
import { useMemo, useState } from 'react'

const BasicMenuItem = ({ title, path }: { title: string, path: string }) => {
  return (
    <Link href={path} passHref>
      <Nav.Link >{title}</Nav.Link>
    </Link>
  )
}

const basicMenuLinks = [
  { title: 'Home', path: '/', },
  { title: 'About', path: '/about', },
  { title: 'Prodotti', path: '/prodotto', },
  { title: 'Preventivi', path: '/preventivo', },
  { title: 'Login', path: '/login', },
]

export default function Header() {
  const router = useRouter()
  const authQuery = trpc.useQuery(['auth.currentUser'])
  const [user, setUser] = useState('')

  /*
  useMemo(() => {
    if (authQuery.isSuccess && authQuery.data.id > 0) {
      setUser(authQuery.data.username)
    }
  }, [authQuery.data])
  */

  return (


    /* <Navbar bg="dark" expand="lg">*/
    <Navbar bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand>Gest-Care</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {basicMenuLinks.map((link, index) => (
              <BasicMenuItem {...link} key={index} />
            ))}
            <Link href='/login' >
              <Nav.Link
                onClick={async (e) => {
                  await fetch('/api/auth/logout')
                  router.push('/login')
                }}
              >
                Logout
              </Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
        <div>
          Current user {user}
        </div>
      </Container>
    </Navbar>
  )
}
