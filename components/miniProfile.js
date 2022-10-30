import React, { useState } from 'react'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { useRecoilState } from 'recoil';
import { avatarModalState } from '../atoms/avatarModalAtom';

export default function MiniProfile() {
  const { data: session } = useSession();
  const [isAvatarOpen, setIsAvatarOpen] = useRecoilState(avatarModalState)
  console.log('SESSION', session)

  useState(() => {
    console.log(isAvatarOpen)
  }, [isAvatarOpen])

  return (
    <div className='mt-14 ml-10 flex items-center justify-between'>
      <div className='w-12 h-12 relative rounded-full cursor-pointer'>
        <Image 
          onClick={() => setIsAvatarOpen(true)}
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
