import { useAuth } from '@/lib/auth'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import { LeftNavigation } from '../Navigation/LeftNavigation'
import { Navigation } from '../Navigation/Navigation'

type MainLayoutProps = {
    children: React.ReactNode
}
export const MainLayout = ({ children }: MainLayoutProps) => {

    const { authenticated, currentUser } = useAuth()
  return (
    <React.Fragment>
        <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={false}
            />
             {
                authenticated && (
                    <Navigation 
                     
                    />
                )
            }
            <main>
                {
                    authenticated && (
                        <LeftNavigation />
                    )
                }
               {children}
            </main>
        
    </React.Fragment>
  )
}
