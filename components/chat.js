import { ChevronDownIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { addDoc, arrayUnion, collection, doc, getDocs, onSnapshot, orderBy, 
  query, serverTimestamp, Timestamp, updateDoc, where } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
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
  const { data: session } = useSession()

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
    console.log(searchValue,results)
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
      console.log(doc.data().messages)
      setMessages(doc.data().messages);
    });

    return unsub
  }, [chatId])

  const openConvo = async (e) => {
    e.preventDefault()
    setConvoOpen(true);
    setSearchValue('')

    const convoUsername = e.target.outerText
    console.log('USER: ', convoUsername)
    console.log(users)

    const re = new RegExp(`^${convoUsername}$`)
    const convoUserData = users.filter((user) => user.username.match(re))
    setConvoUser(convoUserData[0])
  }

  const closeConvo = () => {
    setConvoOpen(false)
    setConvoUser([])
    setChatId('')
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
      pt-2 bg-white w-[320px] font-medium shadow-xl'>
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
                    onClick={openConvo}
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
            <div className='h-80 px-4 py-2'>
              {
                messages.map((msg) => (
                  <div key={msg.id} className='flex py-2'>
                    <div className='relative w-8 h-8 flex-shrink-0 mr-2'>
                      <Image src={msg.sender === user ? session.user.image : convoUser.image} alt='profile' layout='fill' />
                    </div>
                    <div className='bg-gray-200 px-3 py-1 rounded-full w-full text-gray-500'>
                      {msg.text}
                    </div>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className='h-80 px-4 py-2'>
              LOL not done yet
            </div>
          )
        }
       

        {/* Messages */}
        <div className='bg-pink p-3'>
          <form onSubmit={sendMessage}>
            <input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Message'
              type='text'
              className='bg-gray-200 text-black px-3 py-1 rounded-full w-full
              focus:ring-gray-400 border-0 placeholder:text-gray-400'
            />
          </form>
        </div>
      </div>
      )}
      
    </>
  )
}

