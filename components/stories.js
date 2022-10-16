import React, { useEffect, useState } from 'react'
import { faker } from '@faker-js/faker'
import Story from './story'

export default function Stories() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const suggestions = [...Array(20)].map((_, i) => (
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
    <div className='flex space-x-2 overflow-x-scroll bg-white
    md:mt-8 -mb-7 md:mb-0 border-gray-200 border rounded-md p-3 scrollbar-thin
    scrollbar-thumb-gray-300 scrollbar-thumb-rounded-full
    scrollbar-track-rounded-full'>
      {
        suggestions.map((profile) => (
          <Story 
            key={profile.id}
            avatar={profile.avatar}
            name={profile.name}
          />
        ))
      }
    </div>
  )
}
