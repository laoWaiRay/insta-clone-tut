import React from 'react'
import Image from 'next/image'

export default function Story({ name, avatar }) {
  return (
    <div>
      <div className='relative rounded-full h-14 w-14 p-[1.5px] 
      border-red-500 border-2 cursor-pointer hover:scale-105 duration-300
      transition-all ease-in-out'>
        <Image src={avatar} height={56} width={56} alt="profile" 
          className='rounded-full'
        />
      </div>
      <p className='text-xs w-14 truncate'>{name}</p>
    </div>
  )
}
