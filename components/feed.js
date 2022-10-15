import React from 'react'
import MiniProfile from './miniProfile'
import Posts from './posts'
import Stories from './stories'
import Suggestions from './suggestions'

export default function Feed() {
  return (
    <main className='grid grid-cols-1 md:grid-cols-2 md:max-w-3xl
    xl:grid-cols-3 xl:max-w-6xl mx-auto pb-14'>
      <section className='col-span-2'>
        <Stories />
        <Posts />
      </section>

      <section className='hidden xl:inline-grid md:col-span-1 relative'>
        <div className='self-start sticky -top-5'>
          <MiniProfile />
          <Suggestions />
        </div>
      </section>
    </main>
  )
}
