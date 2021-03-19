import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Dev's JS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Alex's JS Playground
        </h1>

        <div className={styles.grid}>
          <a href="/2048" className={styles.card}>
            <h3>2048 &rarr;</h3>
            <p>A JavaScript implementation of the classic mobile game.</p>
          </a>
        </div>
      </main>
    </div>
  )
}
