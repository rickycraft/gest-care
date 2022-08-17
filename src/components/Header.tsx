import Link from 'next/link'
import fetchJson from '../lib/fetchJson'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useRouter } from 'next/router';

const BasicMenuItem = ({ title, path }: { title: string, path: string }) => {
  return (
    <Link href={path} passHref>
      <Nav.Link >{title}</Nav.Link>
    </Link>
  )
}

export default function Header() {
  const router = useRouter()
  // basicMenuLinks are links which are always showed regardless of user authentication or user role
  const basicMenuLinks = [
    {
      title: 'Home',
      path: '/',
    },
    {
      title: 'About',
      path: '/about',
    },
    {
      title: 'Prodotti',
      path: '/prodotto',
    },
    {
      title: 'Preventivi',
      path: '/preventivo',
    },
    {
      title: 'Login',
      path: '/login',
    },
  ]
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
                  e.preventDefault()
                  await fetchJson('/api/auth/logout', { method: 'POST' })
                  router.push('/login')
                }}
              >
                Logout
              </Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
