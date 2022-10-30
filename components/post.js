import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  EllipsisHorizontalIcon,
  HeartIcon, 
  PaperAirplaneIcon,
  ChatBubbleLeftEllipsisIcon,
  BookmarkIcon,
  FaceSmileIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartIconFilled
} from '@heroicons/react/24/solid'

import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { db } from '../firebase';
import Moment from 'react-moment';
import PopupMenu from './popupMenu';
import { useRecoilState } from 'recoil';
import { usersState } from '../atoms/usersAtom';

export default function Post({ id, username, img, userImgOATH, caption }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userImg, setUserImg] = useState('')
  const [usersData, setUsersData] = useRecoilState(usersState);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'posts', id, 'comments'), orderBy('timestamp', 'desc')), 
      (snapshot) => setComments(snapshot.docs))

    const userData = usersData.filter((user) => user.username === username)
    setUserImg(userData[0]?.image)


    return unsubscribe
  }, [id, username, usersData])

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'posts', id, 'likes')), 
      (snapshot) => setLikes(snapshot.docs))
    
    return unsubscribe
  }, [id])

  useEffect(() => {
    setHasLiked(likes.findIndex(like => (like.id === session?.user?.uid)) !== -1)
  }, [likes, session?.user?.uid])

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid))
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
        username: session.user.username,
      })
    }
  }

  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment('');

    await addDoc(collection(db, 'posts', id, 'comments'), {
      comment: commentToSend,
      username: session.user.name,
      userImage: session.user.image ? session.user.image : null,
      timestamp: serverTimestamp(),
    });
  }

  const deleteComment = async (e, commentId) => {
    e.preventDefault();
    
    try {
      await deleteDoc(doc(db, 'posts', id, 'comments', commentId));
      console.log('Successfully deleted comment: ', commentId)
    } catch (error) {
      console.log('Error deleting comment')
    }
  }
  
  const deletePost = async (e, postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      console.log('Successfully deleted post: ', postId)
    } catch (error) {
      console.log('Error deleting post')
    }
  }

  const getCommentImg = (commentUsername) => {
    console.log("USERNAME", usersData)
    const userData = usersData.filter((user) => user.username == commentUsername)
    return userData[0]?.image || '/images/default_avatar.jpg'
  }

  return (
    <div className='bg-white'>
      {/* Header */}
      <div className='flex items-center p-5 bg-white mt-7 rounded-sm relative z-20'>
        <div className='rounded-full h-12 w-12 object-contain border cursor-pointer p-0.5 mr-3'>
          <Image src={userImg || userImgOATH || '/images/default_avatar.jpg'} height={48} width={48} alt="author"
            className='rounded-full'
          />
        </div>
        <p className='flex-1 font-bold'>{username}</p>
        <EllipsisHorizontalIcon className='h-8 cursor-pointer select-none'
          onClick={() => setIsPopupOpen(!isPopupOpen)}
        />
        {isPopupOpen && 
          <PopupMenu 
            postId={id}
            deletePost={deletePost}
            closePopup={() => setIsPopupOpen(false)}
          />
        }
      </div>

      {/* Image */}
      <div className='relative w-full aspect-square'>
        <Image src={img} layout='fill' objectFit='contain' alt='content' className='object-cover' />
      </div>

      {/* Buttons */}
      <div className='flex items-center justify-between px-4 pt-3'>
        <div className='flex space-x-4 py-3'>
          {
            hasLiked ?
            <HeartIconFilled className='btn fill-red-500' onClick={likePost} /> :
            <HeartIcon className='btn' onClick={likePost} />
          }
          
          <ChatBubbleLeftEllipsisIcon className='btn' />
          <PaperAirplaneIcon className='btn -rotate-90' />
        </div>

        <BookmarkIcon className='btn'/>
      </div>

      <p className='px-5 font-bold pb-2'>
        {likes.length} {likes.length == 1 ? 'like' : 'likes'}
      </p>

      {/* Caption */}
      <div className='flex items-center px-5'>
        <div className='inline-block font-bold mr-2 max-w-20 truncate'> { username } </div>
        {caption}
      </div>

      {/* comments */}
      {comments.length > 0 && (
        <div className='mt-4 mx-4 max-h-20 overflow-y-scroll scrollbar-thumb-gray-300 scrollbar-thin'>
          {comments.map((comment) => (
            <div key={comment.id} 
              className='flex items-center mb-2'
            >
              <div className='flex items-center space-x-4'>
                <div className='w-8 h-8 rounded-full relative'>
                  <Image src={getCommentImg(comment.data().username)}
                    alt='profile' layout='fill' className='rounded-full'
                  />
                </div>
                <p className='text-sm flex-1 pr-3'>
                  <span className='font-bold'>{comment.data().username + " "}</span>
                  {comment.data().comment}
                </p>
              </div>

              <Moment fromNow className='pr-3 text-xs ml-auto flex-shrink-0'>
                {comment.data().timestamp?.toDate()}
              </Moment>

              <XMarkIcon className='w-5 h-5 mr-5 hover:cursor-pointer flex-shrink-0'
                onClick={(e) => deleteComment(e, comment.id)}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* input box */}
      <form className='flex items-center p-4'>
        <FaceSmileIcon className='h-7 cursor-pointer' />
        <input type='text' placeholder='Leave a comment...'
          value={comment}
          onChange={e => setComment(e.target.value)}
          className='border-none flex-1 focus:ring-0 outline-none
          mx-3'
        />
        <button className={`font-semibold ${!comment.trim() ? 'text-blue-400' : 'text-blue-700'}`}
          disabled={!comment.trim()}
          onClick={sendComment}
        >
          Post
        </button>
      </form>
    </div>
  )
}
