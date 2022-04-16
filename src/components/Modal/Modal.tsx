import React from 'react'

type ModalProps = {
  children: React.ReactNode
}
export default function Modal({children}: ModalProps) {
    return (
        <div className='modal'>
            <div className='modal__content'>
                {children}
            </div>
        </div>
    )
}
