import React, { useEffect, useState } from 'react'
import { faker } from '@faker-js/faker'
import Image from 'next/image';


export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const suggestions = [...Array(5)].map((_, i) => (
      {
        id: i,
        name: faker.name.fullName(),
        avatar: faker.internet.avatar(),
        company: faker.company.name()
      }
    ));

    setSuggestions(suggestions);
  }, [])

  return (
    <div className='mt-5 ml-10'>
      <div className='flex justify-between text-sm mb-5'>
        <h3 className='text-sm font-bold text-gray-400'>Suggested for you</h3>
        <button className='text-gray-600 font-semibold'>See All</button>
      </div>

      {
        suggestions.map((suggestion) => (
          <div key={suggestion.id} className='flex items-center mt-3 justify-between'>
            <div className='w-10 h-10 relative border p-[2px] rounded-full'>
              <Image src={suggestion.avatar} layout='fill' alt='suggested friend' 
                className='rounded-full'
              />
            </div>
            <div className='flex-1 ml-4'>
              <h2 className='font-semibold text-sm'>{suggestion.name}</h2>
              <h3 className='text-xs text-gray-400'>{suggestion.company}</h3>
            </div>
          </div>
        ))
      }
    </div>
  )
}
