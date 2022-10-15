import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <div className='flex flex-col items-center mb-16 px-14'>
      <div className='space-x-2 text-center'>
        <span className='text-sm text-gray-500 cursor-pointer'>Meta</span>
        <span className='text-sm text-gray-500 cursor-pointer'>About</span>
        <span className='text-sm text-gray-500 cursor-pointer'>Blog</span>
        <span className='text-sm text-gray-500 cursor-pointer'>Help</span>
        <span className='text-sm text-gray-500 cursor-pointer'>API</span>
        <span className='text-sm text-gray-500 cursor-pointer'>Privacy</span>
        <span className='text-sm text-gray-500 cursor-pointer'>Terms</span>
        <span className='text-sm text-gray-500 cursor-pointer'>Top Accounts</span>
        <span className='text-sm text-gray-500 cursor-pointer'>Hashtags</span>
        <span className='text-sm text-gray-500 cursor-pointer'>Locations</span>
        <span className='text-sm text-gray-500 cursor-pointer'>Instagram Lite</span>
        <span className='text-sm text-gray-500 cursor-pointer'>Contact Uploading & Non-Users</span>
      </div>

      <div className='space-x-2'>
        <span className='text-sm text-gray-500 cursor-pointer'>Dance</span>
        <span className='text-sm text-gray-500 cursor-pointer'>Food & Drink</span>
        <span className='text-sm text-gray-500 cursor-pointer'>Home & Garden</span>
        <span className='text-sm text-gray-500 cursor-pointer'>Music</span>
        <span className='text-sm text-gray-500 cursor-pointer'>Visual Arts</span>
      </div>
      
      <div className='space-x-2 my-2'>
        <span className='text-sm text-gray-500 cursor-pointer mr-2'>
          English
          <ChevronDownIcon className='inline h-3 ml-1' />
        </span>
        <span className='text-sm text-gray-500'>&#169; 2022 Instagram from Meta</span>
      </div>
    </div>
  )
}
