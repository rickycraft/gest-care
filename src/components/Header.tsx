import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { useRouter } from 'next/router'
import { trpc } from 'utils/trpc'
import { useEffect, useMemo, useState } from 'react'
import { userAtom } from 'utils/atom'
import { useAtom } from 'jotai'

const BasicMenuItem = ({ title, path }: { title: string, path: string }) => {
  return (
    <Link href={path} passHref>
      <Nav.Link >{title}</Nav.Link>
    </Link>
  )
}

const basicMenuLinks = [
  { title: 'Home', path: '/', },
  { title: 'Prodotti', path: '/listino/prodotto', },
  { title: 'Perso', path: '/listino/personalizzazione', },
  { title: 'Preventivi', path: '/preventivo/list', },
]

const invalidUser = -1

export default function Header() {
  const [user,] = useAtom(userAtom)

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
            {user.isLoggedIn && <BasicMenuItem title="Logout" path="/logout" />}
            {!user.isLoggedIn && <BasicMenuItem title="Login" path="/login" />}
          </Nav>
        </Navbar.Collapse>
        <div className='text-white' hidden={user.id == invalidUser}>
          Current user {user.username}
        </div>
      </Container>
    </Navbar>
  )
}
