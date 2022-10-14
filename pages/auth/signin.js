import { getProviders, signIn as SignIntoProvider } from 'next-auth/react'
import React, { useEffect } from 'react'
import Image from 'next/image';

export default function SignIn({ providers }) {
  useEffect(() => {
    const images = document.getElementsByClassName('iphone-img');
    let index = 1;
  
    const interval = setInterval(() => {
      if (index === 0)
        images[images.length - 1].style.opacity = 0;
      else
        images[index - 1].style.opacity = 0;

      images[index].style.opacity = 1;
      index++;
      if (index === (images.length))
        index = 0;
      console.log(index);
    }, 4000)

    return () => clearInterval(interval);
  }, [])

  return (
    <>
      <div className='flex justify-center mt-10'>
        <div className="h-[581.15px] w-[380.3px] bg-[url('/images/login/iphone_bg.png')]
          login-phone-bg relative"
        >
          <div className='w-full h-[21px]'></div>
          <div className='iphone-img opacity-100'>
            <Image src='/images/login/iphone_1.png' layout='fill' alt='iphone screen' />
          </div>
          <div className='iphone-img'>
            <Image src='/images/login/iphone_2.png' layout='fill' alt='iphone screen' />
          </div>
          <div className='iphone-img'>
            <Image src='/images/login/iphone_3.png' layout='fill' alt='iphone screen' />
          </div>
          <div className='iphone-img'>
            <Image src='/images/login/iphone_4.png' layout='fill' alt='iphone screen' />
          </div>
        </div>

        <div className='flex flex-col items-center
        py-10 px-14 text-center'>
          <div className='w-60 h-20 relative'>
            <Image src='/images/Instagram_logo_word.png' alt='instagram logo' layout='fill' className='w-80'/>
          </div>

          <div className='mt-10'>
            {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button 
                  onClick={() => SignIntoProvider(provider.id)}
                  className={`p-3 my-1 bg-blue-500 rounded-lg text-white 
                  ${provider.id === "github" ? "bg-gray-800" : ""}
                  font-semibold`}
                >
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers
    }
  }
}
