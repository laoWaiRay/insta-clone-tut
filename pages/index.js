import Head from "next/head"
import Feed from "../components/feed"
import Header from "../components/header"
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   if (!session) {
  //     router.push("/login")
  //   }
  // }, [])

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
    </div>
  )
}
