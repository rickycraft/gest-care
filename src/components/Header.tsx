import Link from 'next/link'
import useUser from '../lib/useUser'
import { useRouter } from 'next/router'
import fetchJson from '../lib/fetchJson'

export default function Header() {
  const { user, mutateUser } = useUser()
  const router = useRouter()
  console.log("user: ", user )

  return (
    <header>
      <nav>
        <ul>
          {user?.isLoggedIn === false && (
            <li>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </li>
          )}
          {user?.isLoggedIn === true && (
            <>
              <li>
                <Link href="/">
                  <a 
                    onClick={async (e) => {
                    e.preventDefault()
                    mutateUser(
                      await fetchJson('/api/auth/logout', { method: 'POST' }),
                      false
                    )
                    router.push('/login')
                  }}
                  >
                  Logout
                </a>
                </Link>

              </li>
              <li>
               <Link href="/">
                <a>Home</a>
              </Link>
              </li>
            </>
          )}
          <li>

          </li>
        </ul>
      </nav>
      <style jsx>{`
        ul {
          display: flex;
          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }

        li {
          margin-right: 1rem;
          display: flex;
        }

        li:first-child {
          margin-left: auto;
        }

        a {
          color: #fff;
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        a img {
          margin-right: 1em;
        }

        header {
          padding: 0.2rem;
          color: #fff;
          background-color: #333;
        }
      `}</style>
    </header>
  )
}
