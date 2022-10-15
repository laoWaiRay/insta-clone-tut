import React from 'react'
import Link from 'next/link'

export default function Redirect() {
  return (
    <div className='flex bg-slate-50 min-h-screen justify-center items-center'>
      <div>
        <div className='flex flex-col items-center'>
          <div className='mb-3'>You must be logged in to see this content.</div>
          <Link href="/api/auth/signin">
            <a className='text-blue-600'>Log In</a>
          </Link>
        </div>
      </div>
    </div>
  )
}
