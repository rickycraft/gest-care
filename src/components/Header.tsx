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
  const menuLinks = [
    {
      title: 'Home',
      path: '/',
    },
    {
      title: 'About',
      path: '/about',
    },
    {
      title: 'Login',
      path: '/login',
    },
  ]
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#home">React-Bootstrap Navbar</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {menuLinks.map((link, index) => (
              <BasicMenuItem {...link} key={index} />
            ))}
            <Link href='/login' >
              <Nav.Link onClick={async (e) => {
                    e.preventDefault()
                    await fetchJson('/api/auth/logout', { method: 'POST' })
                      router.push('/login')
                  }}>
                    Logout
              </Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}