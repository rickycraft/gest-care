// import { User } from '../pages/api/user'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from "server/iron"
import Head from 'next/head'
import Image from 'next/image'
import { trpc } from 'utils/trpc'
import styles from '../../styles/Home.module.css'
import { InferGetServerSidePropsType } from "next";
// import useUser from 'lib/useUser'
import fetchJson from '../lib/fetchJson'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  if (user === undefined || user?.username === ''  || user?.id === -1) { //controllo debole ma solo per rendere l'idea
  }
  if (user!==undefined) {
    const userQuery = trpc.useQuery(['user.byUsername', { username: user.username }])

    if (userQuery.isLoading) return <div>Loading...</div>
    if (userQuery.isError) return <div>Error: {userQuery.error.message}</div>
    return (
        <div className="container">
          <Head>
            <title>Create Next App</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main className={styles.main}>
            <h1 className={styles.title}>
              Index page
            </h1>
            <h2>
              If you logged in, your username is: {user?.username}
            </h2>

            <div className={styles.grid}>
              <a href="prodotto" className={styles.card}>

                <h2>Go to prodotti &rarr;</h2>
                <p>Pagina che serve a leggere o modificare la lista di prodotti</p>
                </a>
                <Link href="prodotto"  >
                  <a
                  onClick={async (e) => {
                    e.preventDefault()
                      await fetchJson('prodotto', { method: 'POST' }),
                    router.push('/prodotto')
                  }}
                  >
                    Another way (under construction)
                  </a>
                </Link>


            </div>
          </main>

          <footer className={styles.footer}>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by{' '}
              <span className={styles.logo}>
                <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
              </span>
            </a>
          </footer>
        </div>
    );
  }
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;

  if (user === undefined) {
    // res.setHeader("location", "/login");
    res.statusCode = 302;
    res.end();
    return {
      props: {
        user: {username:'', id:-1, isLoggedIn:false}, //ATT debole ma da modificare
      },
    };
  }

  return {
    props: { user: req.session.user },
  };
},
  sessionOptions);