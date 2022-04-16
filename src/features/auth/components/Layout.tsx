import React from 'react'
import {ReactComponent as AppIcon}  from '@/assets/icons/instagram.svg';
import { useAuth } from '@/lib/auth';
import { MainLayout } from '@/components/Layout/MainLayout';

interface LayoutProps {
    children: React.ReactNode
}
export const Layout = ({ children}: LayoutProps) => {
    return (
        <MainLayout>
            <div className="auth-page">
            <div className="app-title-mobile">
                <AppIcon className="app-icon"/>
                <span className="primary-header">
                    Social Bunch
                </span>
            </div>
            <div className="auth">
                <div className="auth__cover">
                    <AppIcon className="app-icon"/>
                    <span className="primary-header">Social Bunch</span>
                    <span className="secondary-header">..... Join the crowd</span>
                </div>
               {children}
            </div>
        </div>
        </MainLayout>
        
    )
}
