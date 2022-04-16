import { Auth } from '@/features/auth/route'
import React from 'react'
import { Navigate } from 'react-router-dom'

export const publicRoutes = [
  {
    path: '/auth',
    element: <Auth/>
  },
  {
    path: '*',
    element: <Navigate to='/auth'/>
  }
]