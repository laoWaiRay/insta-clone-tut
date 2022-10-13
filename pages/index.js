import Head from "next/head"
import Feed from "../components/feed"
import Header from "../components/header"

export default function Home() {
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
