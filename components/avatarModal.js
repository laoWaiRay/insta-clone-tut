import React, { Fragment, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { avatarModalState } from '../atoms/avatarModalAtom'
import { Dialog, Transition } from '@headlessui/react'
import { CameraIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { db, storage } from '../firebase'
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadString } from 'firebase/storage'

export default function AvatarModal() {
  const { data: session } = useSession();
  const [isAvatarOpen, setIsAvatarOpen] = useRecoilState(avatarModalState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);

  const addImageToPost = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result)
    }
  }

  const removeImageFromPost = (e) => {
    filePickerRef.current.value = '';
    // console.log('FILEPICKER: ', filePickerRef.current)
    // console.log(selectedFile)
    setSelectedFile(null)
  }

  const uploadPost = async () => {
    if (loading)
      return;

    setLoading(true);

    // 1 Create A Post and Add to FireStore 'posts' collection
    // 2 Get the Post ID for the newly created post
    // 3 Upload image to firebase storage with post ID
    // 4 Get a download URL from firebase storage and update feed

    // const docRef = await addDoc(collection(db, 'users', session.id), {
    //   username: session.user.username,
    //   caption: captionRef.current.value,
    //   profileImg: session.user.image ? session.user.image : null,
    //   timestamp: serverTimestamp()
    // })

    const docRef = await getDoc(doc(db, 'users', session.user.uid));

    console.log("New doc added with ID", docRef)

    // Reference to firebase storage ***
    const imageRef = ref(storage, `users/${docRef.id}/avatar`)

    uploadString(imageRef, selectedFile, 'data_url')
      .then(async snapshot => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, 'users', docRef.id), {
          image: downloadURL
        })
      })
    
    setIsAvatarOpen(false)
    setLoading(false)
    removeImageFromPost()
  }

  return (
    <Transition
      show={isAvatarOpen}
      as={Fragment}
    >
      <Dialog
        onClose={() => setIsAvatarOpen(false)}
        className='relative z-50 flex justify-center items-center'
      >
         <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
        {/* Modal Backdrop */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* Modal Panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              className='bg-white inline-block align-bottom rounded-lg px-4 py-5 text-left overflow-hidden
              shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full'
            >

              {
                selectedFile ? (
                  <div
                    className='w-full h-56 cursor-pointer relative'
                  >
                    <Image 
                      src={selectedFile}
                      layout='fill'
                      objectFit='contain'
                      onClick={removeImageFromPost}
                      alt="uploaded file"
                    />
                  </div>
                ) :
                (
                  <div
                    onClick={() => filePickerRef.current.click()}
                    className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 
                    cursor-pointer hover:scale-110 transition-all duration-300'
                  >
                    <CameraIcon 
                      className='h-6 w-6 text-red-600'
                      aria-hidden='true'
                    />
                  </div>
                )
              }
              

              <div className='mt-3 text-center sm:mt-5'>
                <Dialog.Title
                  as="h3"
                  className='text-lg leading-6 font-medium text-gray-900'
                >
                  Edit profile picture
                </Dialog.Title>

                <div>
                  <input 
                    ref={filePickerRef}
                    type='file'
                    hidden
                    onChange={addImageToPost}
                  />
                </div>

                <div className='mt-5 sm:mt-6'>
                  <button
                    type='button'
                    onClick={uploadPost}
                    disabled={loading || !selectedFile}
                    className='inline-flex justify-center w-full border border-transparent shadow-sm
                    px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300
                    disabled:cursor-not-allowed disabled:hover:bg-gray-300'
                  >
                    {
                      loading ?
                      'Uploading...' :
                      'Confirm'
                    }
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>

      </Dialog>
    </Transition>
  )
}
