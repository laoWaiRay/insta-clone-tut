import Head from "next/head"
import Feed from "../components/feed"
import Header from "../components/header"
import Modal from "../components/modal"
import Chat from "../components/chat"

import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import Redirect from "../components/redirect"
import { useRecoilState } from "recoil"
import { chatState } from "../atoms/chatAtom"

export default function Home({ users }) {
  const router = useRouter();
  const { data: session, status } = useSession()
  const [isChatOpen, setIsChatOpen] = useRecoilState(chatState)

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
      {/* Modal */}
      <Modal />
      {/* Header */}
      <Header />
      {/* Feed */}
      <Feed />
      {/* Chat */}
      {isChatOpen &&
        <Chat users={users} />
      }
    </div>
  )
}

export async function getServerSideProps() {
  const querySnapshot = await getDocs(collection(db, "users"));
  const users = []
  querySnapshot.forEach((doc) => users.push(doc.data().username))

  return {
    props: {
      users: users
    }
  }
}
