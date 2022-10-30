import React, { useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { flashState } from '../../atoms/flashAtom';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [flashMsg, setFlashMsg] = useRecoilState(flashState)
  const router = useRouter()

  const sendSignup = async (e) => {
    e.preventDefault();
    if (!password || !confirmation || !username)
    {
      setError('Must not have empty fields')
      return
    }

    if (password != confirmation)
    {
      setError('Passwords do not match')
      return
    }
    const querySnapshot = await getDocs(query(collection(db, "users"), where('username', '==', username)));
    if (querySnapshot.size > 0) {
      setError('Username already in use')
      return
    } else {
      const imageRef = ref(storage, 'default_avatar.jpg')
      const downloadURL = await getDownloadURL(imageRef);

      addDoc(collection(db, 'users'), {
        username: username,
        password: password,
        image: downloadURL
      })
      setError('')
      setFlashMsg("Successfully created account")
      router.push('/auth/signin')
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 flex justify-center items-center'>
      <div className='bg-white flex flex-col items-center p-3 mx-6 max-w-sm'>
        <div className='w-52 h-20 relative mx-auto mt-2'>
          <Image src='/images/instagram-logo-word.png' alt='instagram logo' layout='fill' />
        </div>
        <h1 className='font-bold text-lg mb-4'>Register a new account</h1>
        {error && (
          <p className='text-red-500 -mt-2 mb-2'>{error}</p>
        )}
        <form 
          className='px-3 '
          onSubmit={sendSignup}
        >
          <input type='text' placeholder='Phone number, username, or email' 
            value={username} onChange={(e) => setUsername(e.target.value)}
            autoComplete='off'
            className='input mb-2'
          />
          <input type='password' placeholder='Password' 
            value={password} onChange={(e) => setPassword(e.target.value)}
            className='input mb-3'
          />
          <input type='password' placeholder='Confirm Password' 
            value={confirmation} onChange={(e) => setConfirmation(e.target.value)}
            className='input mb-3'
          />
          <button 
            className={`p-1 w-full text-white rounded-sm
            mb-4 ${username ? 'cursor-pointer bg-blue-500' : 'bg-blue-200'}`}
            disabled={!username}
          >
            Sign Up
          </button>
        </form>
        <Link href='/auth/signin'>
          <a className='font-medium'>Return to login page</a>
        </Link>
      </div>
    </div>
  )
}
