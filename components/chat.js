import { MicrophoneIcon, ChevronDownIcon, ChevronLeftIcon, PhotoIcon, FaceSmileIcon } from '@heroicons/react/24/outline'
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { addDoc, arrayUnion, collection, doc, getDocs, onSnapshot, orderBy, 
  query, serverTimestamp, Timestamp, updateDoc, where } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Moment from 'react-moment'
import { db } from '../firebase'

// const messages = [
//   {
//     id: 1,
//     text: 'Hey',
//     userImg: '/images/av1.jpg'
//   },
//   {
//     id: 2,
//     text: 'What\'s up?',
//     userImg: '/images/av2.jpg'
//   },
//   {
//     id: 3,
//     text: 'Not much you?',
//     userImg: '/images/av1.jpg'
//   }
// ]

export default function Chat({ users, setIsChatOpen, miniChat, setMiniChat, toggleMiniChat, user, isChatOpen }) {
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [convoOpen, setConvoOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [convoUser, setConvoUser] = useState([])
  const [messages, setMessages] = useState([])
  const [chatId, setChatId] = useState('')
  const [allConvos, setAllConvos] = useState([])
  const messagesRef = useRef(null)
  const timeRef = useRef(0)
  const { data: session } = useSession()

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "chats"), where('users', 'array-contains', user)), (querySnapshot) => {
      const tmp = []
      querySnapshot.forEach((doc) => {
        tmp.push(doc.data())
        tmp.sort((a, b) => b.messages[b.messages.length - 1]?.timestamp - a.messages[a.messages.length - 1]?.timestamp)
      })
      setAllConvos(tmp)
    });

    return unsub
  }, [user])

  // ReGex is fun...
  useEffect(() => {
    let re;
    if (searchValue) {
      re = new RegExp(`(${searchValue}.*)`, 'i')
    }
    else {
      re = new RegExp('\b\B')
    }
    const results = users.filter((user) => user.username.match(re))
    setSearchResults(results)
  }, [searchValue, users])

  useEffect(() => {
    if (convoUser.length === 0)
      return
    if (convoUser.username === user)
    {
      const fetchData = async() => {
        const querySnapshot = await getDocs(query(collection(db, 'chats'), 
          where('users', 'array-contains', user),
          where('self', '==', true)
        ))

        if(querySnapshot.size > 0)
        {
          setChatId(querySnapshot.docs[0].id)
          return
        }
        else
        {
          await addDoc(collection(db, 'chats'), {
            users: [user],
            messages: [],
            self: true,
            timestamp: serverTimestamp(),
          });
        } 
      }
      fetchData()
      return
    }

    const fetchData = async () => {
      const querySnapshot = await getDocs(query(collection(db, 'chats'), where('users', 'array-contains', user)))
      let chat = null
      querySnapshot.docs.forEach((doc) => {
        if (doc.data().users.includes(user) && doc.data().users.includes(convoUser.username))
        {
          chat = doc
        }
      })
      
      if (!chat) {
        await addDoc(collection(db, 'chats'), {
          users: [user, convoUser.username],
          messages: [],
          self: false,
          timestamp: serverTimestamp(),
        });
      } else {
        setChatId(chat.id)
      }
    }

    fetchData()
    
  }, [convoUser, user])

  useEffect(() => {
    if (!isChatOpen)
    {
      closeConvo()
    }
  }, [isChatOpen])

  useEffect(() => {
    if (chatId === '')
      return
    const unsub = onSnapshot(doc(db, "chats", chatId), (doc) => {
      setMessages(doc.data().messages);
    });

    return unsub
  }, [chatId])

  useEffect(() => {
    if (convoOpen) {
      const element = messagesRef.current
      element.scrollTop = element.scrollHeight
    }
  }, [convoOpen, messages])

  const openConvo = async (e, convoUsername) => {
    e.preventDefault()
    setConvoOpen(true);
    setSearchValue('')

    const re = new RegExp(`^${convoUsername}$`)
    const convoUserData = users.filter((user) => user.username.match(re))
    setConvoUser(convoUserData[0])
  }

  const closeConvo = () => {
    setConvoOpen(false)
    setConvoUser([])
    setChatId('')
    setMessages([])
  }

  const sendMessage = async (e) => {
    e.preventDefault();

    const messageToSend = message;
    setMessage('');

    const chatRef = doc(db, 'chats', chatId);
    const created_at = Timestamp.now()

    await updateDoc(chatRef, {
      messages: arrayUnion({
        text: messageToSend,
        sender: user,
        timestamp: created_at
      })
    })
  }

  const getConvoUsername = (convo) => {
    return convo.users.length === 1 ? convo.users[0] : convo.users[0] != user ? convo.users[0] : convo.users[1]
  }

  const shouldDisplayTimestamp = (time) => {
    console.log("TIME REF: ", timeRef.current)
    if (Math.abs(timeRef.current - time) > 60 * 60)
    {
      timeRef.current = time
      return true
    }
    timeRef.current = time
    return false
  }

  return (
    <>
    {
      miniChat ? (
        <div onClick={() => setMiniChat(false)}
          className='fixed bottom-0 right-10 z-50 border-2 border-b-0 border-slate-300
          py-1 bg-white w-[150px] flex items-center font-medium justify-between px-2 
          cursor-pointer rounded-t-xl text-slate-500'
        >
          <span className='w-full flex justify-center'>Chat</span>
          <button onClick={() => toggleMiniChat()}>
              <XMarkIcon className='w-5 h-5'/>
          </button>
        </div>
      ) :
      (<div className='fixed bottom-0 right-0 z-50 border border-b-0 border-slate-300
      pt-2 bg-white w-full px-2 md:w-[320px] md:px-0 font-medium shadow-xl '>
        {/* Header / Search */}
        <div className='flex items-center relative bg-white z-50 mb-2 h-10'>
          {
            convoOpen ?
            (
              <div className='flex w-full pl-2 items-center'>
                <ChevronLeftIcon className='h-6 w-8 mr-3 cursor-pointer text-gray-800'
                  onClick={closeConvo}
                />
                <div className='flex items-center'>
                  <div className='h-8 w-8 relative rounded-full mr-2'>
                    <Image src={convoUser?.image || '/images/default_avatar.jpg'} alt='avatar' layout='fill' 
                      className='rounded-full'
                    />
                    <div className='absolute bg-white rounded-full right-0 
                    bottom-0 p-0.5'>
                      <div className='h-2 w-2 bg-green-300 rounded-full' /> 
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <div className='text-sm'>{convoUser.username}</div>
                    <div className='text-xs text-gray-400'>Active now</div>
                  </div>
                </div>
              </div>
            ) :
            (
              <input 
                type='text' 
                placeholder='Search'
                className='mx-2 py-1 w-full rounded-lg text-black 
                placeholder:text-gray-400 border-0 bg-gray-200 focus:ring-gray-400'
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
              />
            )
          }
          
          <div className='flex items-center mr-3 ml-4'>
            <button onClick={() => toggleMiniChat()}>
              <ChevronDownIcon className='w-5 h-5 text-gray-400'/>
            </button>
            <button onClick={() => setIsChatOpen(false)}>
              <XMarkIcon className='w-5 h-5 text-gray-400'/>
            </button>
          </div>
          
          {/* Search Suggestions */}
          { searchResults.length > 0 && (
            <div className='absolute w-full top-10 max-h-30 overflow-y-scroll scrollbar-thin border text-gray-600 bg-white'>
              {
                searchResults.map((user) => (
                  <div 
                    key={user.username}
                    className="border-b px-3 py-2 flex items-center cursor-pointer hover:bg-slate-100"
                    onClick={(e) => openConvo(e, e.target.outerText)}
                  >
                    <div className='h-6 w-6 relative rounded-full mr-2'>
                      <Image src={user.image || '/images/default_avatar.jpg'} alt='avatar' layout='fill' 
                        className='rounded-full'
                      />
                    </div>
                    {user.username}
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* Main - Convo */}
        {
          convoOpen ? (
            <>
              <div 
                className='h-96 md:h-80 px-4 py-2 overflow-y-auto scroll z-50'
                ref={messagesRef}
              >
                {
                  messages.map((msg) => (
                    <div key={msg.timestamp} >
                      {shouldDisplayTimestamp(msg.timestamp.seconds) &&
                        <Moment format='ddd, MMM D LT' className='text-sm text-gray-400 my-1 block'>
                          {msg.timestamp.toDate()}
                        </Moment>
                      }
                      <div className='flex py-2'>
                        <div className={`relative w-8 h-8 flex-shrink-0 mr-2 rounded-full ${msg.sender != user && 'order-2 mr-0 ml-2'}`}>
                          <Image src={msg.sender === user ? session.user.image : convoUser.image} 
                            className='rounded-full' alt='profile' layout='fill' 
                          />
                        </div>
                        <div className='bg-gray-200 px-3 py-1 rounded-full w-full text-gray-500'>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
              {/* Messages */}
              <div className='p-3 h-14'>
                  <form onSubmit={sendMessage}>
                    <div className='relative'>
                      <div className='absolute h-[26px] w-[26px] bottom-0.5 left-1 rounded-full border border-blue-500 bg-blue-500 p-[3px] flex'>
                        <CameraIcon className='inline-block text-white' />
                      </div>
                      <input 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder='Message'
                        type='text'
                        className='bg-gray-200 text-black px-3 pl-9 py-1 pr-24 rounded-full w-full
                        focus:ring-gray-400 border-0 placeholder:text-gray-400'
                      />
                      <div className='absolute right-2 top-1 flex space-x-2'>
                        <MicrophoneIcon className='h-6 w-6'/>
                        <PhotoIcon className='h-6 w-6' />
                        <FaceSmileIcon className='h-6 w-6' />
                      </div>
                    </div>
                  </form>
              </div>
            </>
          ) : (
            <div className='h-[440px] md:h-[376px] overflow-y-auto'>
              {
                allConvos.map((convo) => (
                  <div 
                    key={convo.timestamp.seconds}
                    onClick={(e) => openConvo(e, getConvoUsername(convo))}
                    className='flex items-center py-2 px-2 cursor-pointer hover:bg-slate-100'
                  >
                    <div className='relative h-10 w-10 mr-3 rounded-full'>
                      <Image 
                        src={ users.find((user) => user.username === getConvoUsername(convo)).image } 
                        alt='profile' 
                        layout='fill'
                        className='rounded-full'
                      />
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-bold'>{ getConvoUsername(convo) }</span>
                      <span>{ convo.messages[convo.messages?.length - 1]?.text }</span>
                    </div>    
                  </div>
                ))
              }
            </div>
          )
        }
       

        
      </div>
      )}
      
    </>
  )
}

