import { getProviders, signIn as SignIntoProvider } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Footer from '../../components/footer';

export default function SignIn({ providers }) {
  console.log(providers)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const images = document.getElementsByClassName('iphone-img');
    let index = 1;
    let started = false;
  
    const interval = setInterval(() => {
      if (!started)
      {
        images[0].style.opacity = 0;
        console.log("started")
        started = true;
      }

      if (index === 0)
        images[images.length - 1].style.opacity = 0;
      else
        images[index - 1].style.opacity = 0;

      images[index].style.opacity = 1;
      index++;
      if (index === (images.length))
        index = 0;
    }, 4000)

    return () => clearInterval(interval);
  }, [])

  const renderIphoneImages = () => {
    const images = [];
    for (let i = 1; i <= 4; i++) {
      images.push (
        <div className={`iphone-img ${ i === 1 ? 'opacity-100' : 'opacity-0' }`} key={i}>
          <Image src={`/images/login/iphone_${i}.png`} layout='fill' alt='iphone screen' />
        </div>
      )
    }
    return images
  }

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col justify-between'>
      <div className='flex justify-center pt-12 lg:pt-24'>
        <div className="h-[581.15px] w-[380.3px] bg-[url('/images/login/iphone_bg.png')]
          login-phone-bg relative hidden lg:block"
        >
          <div className='w-full h-[21px]'></div>
          {
            renderIphoneImages()
          }
        </div>
        
        {/* Right panel */}
        <div className='flex flex-col flex-1 max-w-sm'>
          <div className='flex flex-col items-center
          text-center mt-3'>

            <div className='bg-white border w-full px-10 pt-8'>
              <div className='w-52 h-20 relative mx-auto'>
                <Image src='/images/instagram_logo_word.png' alt='instagram logo' layout='fill' />
              </div>

              <div className='mt-6'>
                {Object.values(providers).map((provider) => (
                  provider.id === 'credentials' ?
                  <div key={provider.name}>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      SignIntoProvider("credentials", { callbackUrl: '/' });
                    }}>
                      <input type='text' placeholder='Phone number, username, or email' 
                        value={username} onChange={(e) => setUsername(e.target.value)}
                        className='input mb-2'
                      />
                      <input type='password' placeholder='Password' 
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        className='input mb-3'
                      />
                      <button 
                        className='bg-blue-200 p-1 w-full text-white rounded-sm
                        mb-4 cursor-pointer'
                      >
                        Log In
                      </button>
                    </form>
                    <div className='mb-4 flex items-center'>
                      <div className='h-[1px] w-full border'></div>
                      <div className='text-gray-400 text-sm font-bold mx-4'>OR</div>
                      <div className='h-[1px] w-full border'></div>
                    </div>
                  </div> :
                  <div key={provider.name} className="flex justify-center">
                    <button 
                      onClick={() => SignIntoProvider(provider.id, { callbackUrl: '/' })}
                      className={`p-[10px] my-1 bg-blue-500 rounded-lg text-white text-sm
                      flex items-center
                      ${provider.id === "github" ? "bg-gray-800" : ""}`}
                    >
                      {
                        provider.id === "github" && 
                        <Image src="/images/github-logo.png" alt='github logo' height={24} width={24} />
                      }
                      {
                        provider.id === "google" && 
                        <div className='bg-white flex rounded-full p-[1px] -mr-[2px]'>
                          <Image src="/svg/google-logo.svg" alt='google logo' height={23} width={23} />
                        </div>
                      }
                      <span className='ml-2'>Sign in with {provider.name}</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className='pt-5 pb-6 text-sm'>
                <span className='cursor-pointer text-gray-500'>Forgot password?</span>
              </div>
            </div>

            <div className='bg-white py-4 px-14 my-3 border text-sm w-full'>
              <span>Don&apos;t have an account?</span>
              <span className='font-semibold text-blue-400 ml-1 cursor-pointer'>Sign up</span>
            </div>

            <div className='my-1 px-14 text-sm w-full'>
              <span className='block mb-3'>Get the app.</span>
              <div className='w-full flex justify-center'>
                <button className="h-[40px] w-[136px] relative">
                  <Image src="/svg/apple-store-badge.svg" layout='fill' alt='google play badge' />
                </button>
                <button className="h-[60px] w-[140px] -my-[10px] relative">
                  <Image src="/images/play_badge.png" layout='fill' alt='google play badge' />
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <Footer />
    </div>
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
