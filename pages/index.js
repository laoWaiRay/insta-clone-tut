import Head from "next/head"
import Feed from "../components/feed"
import Header from "../components/header"
import Modal from "../components/modal"
import Chat from "../components/chat"
import AvatarModal from "../components/avatarModal"

import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import Redirect from "../components/redirect"
import { useRecoilState } from "recoil"
import { chatState } from "../atoms/chatAtom"
import { avatarModalState } from '../atoms/avatarModalAtom';
import { useEffect, useState } from "react"
import { usersState } from "../atoms/usersAtom"

export default function Home({ users }) {
  const router = useRouter();
  const [usersData, setUsersData] = useRecoilState(usersState);
  const { data: session, status } = useSession()
  const [isAvatarOpen, setIsAvatarOpen] = useRecoilState(avatarModalState)
  const [isChatOpen, setIsChatOpen] = useRecoilState(chatState)
  const [miniChat, setMiniChat] = useState(false);

  const toggleMiniChat = () => {
    if (miniChat)
      setIsChatOpen(false)
    setMiniChat(!miniChat)
  }

  useEffect(() => {
    setUsersData(users)
  }, [users, setUsersData])

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
        <Chat 
          users={users}
          setIsChatOpen={setIsChatOpen}
          isChatOpen={isChatOpen}
          miniChat={miniChat}
          toggleMiniChat={toggleMiniChat}
          setMiniChat={setMiniChat}
          user={session.user.name}
        />
      }
      {/* Avatar Modal */}
      {isAvatarOpen &&
        <AvatarModal />
      }
    </div>
  )
}

export async function getServerSideProps() {
  const querySnapshot = await getDocs(collection(db, "users"));
  const users = []
  querySnapshot.forEach((doc) => users.push({
    username: doc.data().username,
    image: doc.data().image || null
  }))

  return {
    props: {
      users: users
    }
  }
}
