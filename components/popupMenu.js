import React, { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react';

export default function PopupMenu({ postId, deletePost, closePopup }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDeletePost = () => {
    setIsModalOpen(false)
    deletePost(null, postId)
  }

  return (
    <>
      <div className='absolute right-5 top-16 flex flex-col z-50 bg-white'>
        <button className='border-2 p-2 font-bold text-red-600 select-none'
          onClick={() => setIsModalOpen(true)}
        >
          Delete Post
        </button>
        <button className='border-2 p-2 border-t-0 font-semibold select-none'
          onClick={closePopup}
        >
          Cancel
        </button>
      </div>
      {isModalOpen && 

        <Transition
          show={isModalOpen}
          as={Fragment}
        >
          <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}
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
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className='bg-white inline-block align-bottom rounded-lg p-5 text-left overflow-hidden
              shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full space-y-3'>
                  <Dialog.Title className='font-bold'>Delete Post</Dialog.Title>
                  <Dialog.Description>
                    Are you sure you want to delete your post?
                  </Dialog.Description>

                  <p>
                    This action cannot be undone.
                  </p>

                  <div className='pt-2'>
                    <button
                      className='bg-red-600 text-white border-2 border-red-600 p-2 mr-2' 
                      onClick={onDeletePost}
                    >
                        Delete
                    </button>
                    <button 
                      className='border-black border-2 p-2'
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition> 
      }
    </>
  )
}
