import React, { Fragment } from 'react'
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import { Dialog, Transition } from '@headlessui/react'

export default function Modal() {
  const [open, setOpen] = useRecoilState(modalState);

  // TODO: Read Headless UI Docs and implement this modal on your own
  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as='div'
        className='fixed z-10 inset-0'
        onClose={setOpen}
      >
        <div className='flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 
        px-4 pb-20 text-center sm:block'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay 
              className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
            />
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
