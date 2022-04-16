
import { FullScreenLoader } from '@/components/FullScreenLoader'
import useFirebaseAuth from '@/hook/useFirebaseAuthState'
import React from 'react'

type ProviderProps = {
    children: React.ReactNode
}

const FirebaseAuthState = ({ children }: ProviderProps) => {

    const auth = useFirebaseAuth()

    if (auth.loading) {
        return <FullScreenLoader/>
    }
  return (
    <>{children}</>
  )
}

export default FirebaseAuthState