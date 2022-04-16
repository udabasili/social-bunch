
import { FullScreenLoader } from '@/components/FullScreenLoader'
import useFirebaseAuth from '@/hook/useFirebaseAuthState'
import { useAuth } from '@/lib/auth'
import React from 'react'

type ProviderProps = {
    children: React.ReactNode
}

const FirebaseAuthState = ({ children }: ProviderProps) => {

    const auth = useFirebaseAuth()
    const {loadUser} = useAuth()


    if (auth.loading) {
        return <FullScreenLoader/>
    }
  return (
    <>{children}</>
  )
}

export default FirebaseAuthState