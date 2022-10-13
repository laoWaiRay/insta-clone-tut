import React from 'react'
import Image from 'next/image'
import {
  EllipsisHorizontalIcon,
  HeartIcon, 
  PaperAirplaneIcon,
  ChatBubbleLeftEllipsisIcon,
  BookmarkIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline'

export default function Post({ id, username, userImg, img, caption }) {
  return (
    <div>
      {/* Header */}
      <div className='flex items-center p-5 bg-white mt-7 rounded-sm'>
        <div className='rounded-full h-12 w-12 object-contain border cursor-pointer p-0.5 mr-3'>
          <Image src={userImg} height={48} width={48} alt="author"
            className='rounded-full'
          />
        </div>
        <p className='flex-1 font-bold'>{username}</p>
        <EllipsisHorizontalIcon className='h-8 cursor-pointer'/>
      </div>

      {/* Image */}
      <div className='relative w-full aspect-square'>
        <Image src={img} layout='fill' alt='content' className='object-cover' />
      </div>

      {/* Buttons */}
      <div className='flex items-center justify-between px-4 py-3'>
        <div className='flex space-x-4 py-3'>
          <HeartIcon className='btn' />
          <ChatBubbleLeftEllipsisIcon className='btn' />
          <PaperAirplaneIcon className='btn -rotate-90' />
        </div>

        <BookmarkIcon className='btn'/>
      </div>

      {/* Likes */}
      <div className='flex items-center px-5'>
        <div className='inline-block font-bold mr-1 w-20 truncate'> { username } </div>
        {caption}
      </div>

      {/* comments */}
      
      {/* input box */}
      <form className='flex items-center p-4'>
        <FaceSmileIcon className='h-7 cursor-pointer' />
        <input type='text' placeholder='Leave a comment...' 
          className='border-none flex-1 focus:ring-0 outline-none
          mr-3'
        />
        <button className='font-semibold text-blue-400'>Post</button>
      </form>
    </div>
  )
}
