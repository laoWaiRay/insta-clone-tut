import React, { useEffect, useState } from 'react'
import Post from './post'
import { db } from '../firebase';
import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'posts'), orderBy('timestamp', 'desc')), snapshot => {
      setPosts(snapshot.docs)
    });

    return unsubscribe
  }, [])

  return (
    <div>
      {
        posts.map((post) => (
          <Post 
            key={post.id}
            id={post.id}
            username={post.data()?.username}
            userImg={post.data().profileImg ? post.data().profileImg : '/images/default_avatar.jpg'}
            img={post.data().image}
            caption={post.data()?.caption}
          />
        ))
      }
    </div>
  )
}
