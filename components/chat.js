import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'

export default function Chat({ users }) {
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState([])

  // ReGex is fun...
  useEffect(() => {
    let re;
    if (searchValue) {
      re = new RegExp(`(${searchValue}.*)`, 'i')
    }
    else {
      re = new RegExp('\b\B')
    }
    const results = users.filter((user) => user.match(re))
    setSearchResults(results)
    console.log(searchValue,results)
  }, [searchValue, users])

  return (
    <div className='fixed bottom-0 right-0 z-50 border
    pt-4 bg-white w-[300px]'>
      {/* Header / Search */}
      <div className='flex items-center relative'>
        <input 
          type='text' 
          placeholder='Search'
          className='mx-2 py-1 w-full rounded-lg'
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
        />
        <div className='flex items-center mr-1 ml-4'>
          <button>
            <ChevronDownIcon className='w-5 h-5'/>
          </button>
          <button>
            <XMarkIcon className='w-5 h-5'/>
          </button>
        </div>
        
        {/* Search Suggestions */}
        { searchResults.length > 0 && (
          <div className='absolute w-full top-10 h-24 overflow-y-scroll scrollbar-thin border'>
            {
              searchResults.map((user) => (
                <div 
                  key={user}
                  className="border-b px-3 py-1"
                >
                  {user}
                </div>
              ))
            }
          </div>
        )}
      </div>

      
      
      {/* Main */}
      <div className='bg-white h-80'>
        
      </div>

      {/* Messages */}
    </div>
  )
}

