/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  UserGroupIcon,
  HeartIcon,
  PaperAirplaneIcon,
  Bars3Icon,
  HomeIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PhotoIcon,
  XMarkIcon
} from "@heroicons/react/24/outline"
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRecoilState } from 'recoil';
import { modalState } from '../atoms/modalAtom';
import { chatState } from '../atoms/chatAtom';
import { Transition } from '@headlessui/react'

export default function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const [isChatOpen, setIsChatOpen] = useRecoilState(chatState);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const nodeRef = useRef(null)

  return (
    <div className='z-50 relative'>
      <header className='shadow-sm border-b z-50 bg-white relative'>
        <div className='flex justify-between items-center max-w-6xl mx-auto px-4 z-50'>
          <div className='w-28 h-10 hover:cursor-pointer relative hidden md:inline-grid mt-1'>
            <Image 
              className='object-contain'
              src='/images/instagram-logo-word.png'
              alt='Instagram Logo'
              layout='fill'
            />
          </div>
          <div className='w-10 h-10 hover:cursor-pointer relative md:hidden mt-1'>
            <img 
              className='object-contain'
              src="/svg/insta-logo.svg"
              alt='instagram logo'
            />
          </div>

          <div className='max-w-xs'>
            <div className='mt-1 relative p-3 rounded-md flex items-center'>
              <div className='absolute inset-y-0 pl-3 flex items-center pointer-events-none'>
                <MagnifyingGlassIcon className='h-5 w-5 text-gray-500'/>
              </div>
              <input 
                className='bg-gray-50 block w-full pl-10 sm:text-sm
                border-gray-300 focus:ring-black focus:border-black rounded-md' 
                type="text" 
                placeholder="Search"  
              />
            </div>
          </div>

          <div className='flex justify-center items-center space-x-4'>
            <Bars3Icon 
              className='h-10 w-10 md:hidden hover:cursor-pointer'
              onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
            />
            <HomeIcon className='navBtn'/>
            
            {
              session ? 
              (
                <>
                  <div className='navBtn relative'>
                    <PaperAirplaneIcon className='navBtn -rotate-45' 
                      onClick={() => setIsChatOpen(!isChatOpen)}
                    />
                    {/* <div 
                      className='absolute -top-1 -right-2 text-xs w-5 h-5 
                      bg-red-500 rounded-full flex justify-center items-center
                      text-white'
                    >
                      3
                    </div> */}
                  </div>
                  
                  <PlusCircleIcon 
                    className='navBtn' 
                    onClick={() => setOpen(true)} 
                  />
                  <UserGroupIcon className='navBtn' />
                  <HeartIcon className='navBtn' />
                  <div onClick={() => signOut({ callbackUrl: '/api/auth/signin' })}
                    className='w-10 h-10 relative hover:cursor-pointer'
                  >
                    <Image width={40} height={40} alt="Profile" className='rounded-full'
                      src={
                        session.user.image ?
                        session.user.image :
                        '/images/default_avatar.jpg'
                      } 
                    />
                  </div>
                </>
              ) : 
              <button onClick={signIn}>Sign In</button>
            }
          </div>
        </div>
      </header>
       {/* Mobile Dropdown */}
       <Transition
          show={isMobileDropdownOpen}
          enter="transition-all duration-300 z-50"
          enterFrom="-translate-y-32 z-50"
          enterTo="opacity-100 translate-y-0 z-50"
          leave="transition-all duration-300 z-50"
          leaveFrom="opacity-100 z-50"
          leaveTo="opacity-0"
        >
          <div 
            className='absolute bg-white w-full md:hidden z-40'
          >
            <div 
              className='border-b border-t py-3 flex justify-center cursor-pointer hover:bg-slate-100'
              onClick={() => {setIsChatOpen(true); setIsMobileDropdownOpen(false)}}
            >
              Messages
              <ChatBubbleOvalLeftEllipsisIcon className='h-6 w-6 ml-2'/>
            </div>
            <div 
              className='border-b py-3 flex justify-center cursor-pointer hover:bg-slate-100'
              onClick={() => {setOpen(true); setIsMobileDropdownOpen(false)}}
            >
              Upload Photo
              <PhotoIcon className='h-6 w-6 ml-2'/>
            </div>
            <div 
              className='border-b py-3 flex justify-center cursor-pointer items-center hover:bg-slate-100'
              onClick={() => setIsMobileDropdownOpen(false)}
            >
              Close
              <XMarkIcon className='h-5 w-5 ml-2'/>
            </div>
          </div>
        </Transition>
    </div>
  )
}
