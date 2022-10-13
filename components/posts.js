import React from 'react'
import Post from './post'

const posts = [
  {
    id: '123',
    username: 'jobs123',
    userImg: '/images/profile.jpg',
    img: '/images/post1.jpg',
    caption: 'Hello World!'
  }
]

export default function Posts() {
  return (
    <div>
      {
        posts.map((post) => (
          <Post 
            key={post.id}
            id={post.id}
            username={post.username}
            userImg={post.userImg}
            img={post.img}
            caption={post.caption}
          />
        ))
      }
    </div>
  )
}
