import { useAtom } from 'jotai'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NavDropdown } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { userAtom } from 'utils/atom'
import { canEditUser } from 'utils/role'
import Refresh from './utils/Refresh'

const BasicMenuItem = ({ title, path }: { title: string, path: string }) => {
  return (
    <Link href={path} passHref>
      <Nav.Link >{title}</Nav.Link>
    </Link>
  )
}

const basicMenuLinks = [
  // { title: 'Home', path: '/', hidden: false },
  { title: 'Prodotti', path: '/listino/prodotto', hidden: true },
  { title: 'Perso', path: '/listino/personalizzazione', hidden: true },
  { title: 'Preventivi', path: '/preventivo/list', hidden: false },
  { title: 'Buste', path: '/ordine/list', hidden: false },
]

const emptyPages = ["/auth/login", "/auth/logout", "/preventivo/pdf"]
const defaultRole = 'user'

export default function Header() {
  const router = useRouter()
  const [user,] = useAtom(userAtom)

  if (emptyPages.includes(router.pathname)) return null

  return (
    <Navbar bg="dark" variant="dark" expand="md">
      <Container fluid>
        <Navbar.Brand>Gest-Care</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {basicMenuLinks.filter(link => !link.hidden || user.role != defaultRole)
              .map((link, index) => (
                <BasicMenuItem {...link} key={index} />
              ))}
          </Nav>
          <Nav>
            <NavDropdown align="end" title={user.username.toUpperCase()} menuVariant="dark">
              {canEditUser(user.role) && <NavDropdown.Item href="/auth/user">Utenti</NavDropdown.Item>}
              <Refresh />
              <NavDropdown.Item href="/auth/logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
