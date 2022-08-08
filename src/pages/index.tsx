import Layout from 'components/Layout'
import Image from 'next/image'
<<<<<<< HEAD:pages/index.tsx
import { addUser } from 'scripts/user'
import { User } from '@prisma/client'

export default function Home() {

=======
import { trpc } from 'utils/trpc'
import styles from '../../styles/Home.module.css'

const Home: NextPage = () => {

  const userQuery = trpc.useQuery(['user.byUsername', { username: 'test' }])

  if (userQuery.isLoading) return <div>Loading...</div>
  if (userQuery.isError) return <div>Error: {userQuery.error.message}</div>

>>>>>>> rov:src/pages/index.tsx
  return (

<<<<<<< HEAD:pages/index.tsx
    <Layout>
      <h1>
        <span style={{ marginRight: '.3em', verticalAlign: 'middle' }}>
          <Image src="/GitHub-Mark-32px.png" width="32" height="32" alt="" />
        </span>
        <a href="https://github.com/vvo/iron-session">iron-session</a> -
        Authentication example
      </h1>
=======
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <h2>
          Query result: {userQuery.data?.username}
        </h2>
>>>>>>> rov:src/pages/index.tsx

      <p>
        This example creates an authentication system that uses a{' '}
        <b>signed and encrypted cookie to store session data</b>.
      </p>

      <p>
        It uses current best practices as for authentication in the Next.js
        ecosystem:
        <br />
        1. <b>no `getInitialProps`</b> to ensure every page is static
        <br />
        2. <b>`useUser` hook</b> together with `
        <a href="https://swr.vercel.app/">swr`</a> for data fetching
      </p>

      <h2>Features</h2>

      <ul>
        <li>Logged in status synchronized between browser windows/tabs</li>
        <li>Layout based on logged in status</li>
        <li>All pages are static</li>
        <li>Session data is signed and encrypted in a cookie</li>
      </ul>

      <h2>Steps to test the functionality:</h2>

      <ol>
        <li>Click login and enter your GitHub username.</li>
        <li>
          Click home and click profile again, notice how your session is being
          used through a token stored in a cookie.
        </li>
        <li>
          Click logout and try to go to profile again. You&apos;ll get
          redirected to the `/login` route.
        </li>
      </ol>
      <style jsx>{`
        li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </Layout>
  )
}
