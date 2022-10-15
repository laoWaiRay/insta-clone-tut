import Head from "next/head"
import Feed from "../components/feed"
import Header from "../components/header"
import Modal from "../components/modal"

import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import Redirect from "../components/redirect"

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession()

  console.log(status)

  if (status === 'loading') {
    return
  }

  if (status != 'loading' && !session) {
    return (
      <Redirect />
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>Instagram</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <Header />
      {/* Feed */}
      <Feed />
      {/* Modal */}
      <Modal />
    </div>
  )
}
