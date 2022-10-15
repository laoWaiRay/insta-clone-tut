import React from 'react'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'

export default function MiniProfile() {
  const { data: session } = useSession();

  return (
    <div className='mt-14 ml-10 flex items-center justify-between'>
      <div className='w-12 h-12 relative'>
        <Image 
          src={
            session?.user.image ?
            session.user.image :
            '/images/default_avatar.jpg'
          } 
          layout='fill' alt='profile'
          className='rounded-full'
        />
      </div>
      <div className='mx-4 flex-1'>
        <h2 className='font-bold'>
          { session?.user?.name }
        </h2>
        <h3 className='text-sm text-gray-400'>Welcome to Instagram</h3>
      </div>
      <button className='text-blue-400 text-sm' onClick={signOut}>Sign Out</button>
    </div>
  )
}
