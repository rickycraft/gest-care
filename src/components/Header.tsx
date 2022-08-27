import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { useEffect, useMemo, useState } from 'react'
import { userAtom } from 'utils/atom'
import { useAtom } from 'jotai'
import { NavDropdown } from 'react-bootstrap'

const BasicMenuItem = ({ title, path }: { title: string, path: string }) => {
  return (
    <Link href={path} passHref>
      <Nav.Link >{title}</Nav.Link>
    </Link>
  )
}

const basicMenuLinks = [
  { title: 'Home', path: '/', hidden: false },
  { title: 'Prodotti', path: '/listino/prodotto', hidden: true },
  { title: 'Perso', path: '/listino/personalizzazione', hidden: true },
  { title: 'Preventivi', path: '/preventivo/list', hidden: false },
]

const invalidUser = -1
const defaultRole = 'user'

export default function Header() {
  const [user,] = useAtom(userAtom)

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
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
              <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
