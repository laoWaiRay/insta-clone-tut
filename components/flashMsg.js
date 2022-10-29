import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { flashState } from '../atoms/flashAtom'

export default function FlashMsg() {
  const [flashMsg, setFlashMsg] = useRecoilState(flashState)


  useEffect(() => {
    if (flashMsg)
    {
      setTimeout(() => {
        setFlashMsg('');
      }, 5000);
    }
    
  }, [flashMsg, setFlashMsg])

  return (
    <>
      {flashMsg && (
        <div className='w-full fixed top-0 flex justify-center p-1 bg-pink-300 text-white font-bold'>
          {flashMsg}
        </div>
      )}
    </>
  )
}
