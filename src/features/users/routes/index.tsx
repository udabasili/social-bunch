import { ChangeEvent, useEffect, useState } from 'react'
import { UserAttributes } from '@/features/user/types';
import Users from '../components/Users';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/fuego';
import { useAuth } from '@/lib/auth';
import { MainLayout } from '@/components/Layout/MainLayout';
import { UseGetUsers } from '../api/getAllUsers';
import { FullScreenLoader } from '@/components/FullScreenLoader';


export const UserPage = () => {

    const [currentTab, setCurrentTab] = useState('tab1')
    const { currentUser } = useAuth()
    const {users, isLoading} = UseGetUsers()


   const switchTab = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setCurrentTab(value)
    }

    const getUserFriends = () => {
        let result: Array<any> = []
        const currentUserFriends = currentUser.friends
        if (users){
            result = users.filter(user => currentUserFriends.includes(user.uid))

        }
        return result
    }

    if (isLoading) return ( <FullScreenLoader/>)


    return (
        <MainLayout>
            <div className="users-page">
            <section  className="users--left-section">
                <div className="users__tabset">
                    <input 
                        type="radio" 
                        name="tabset" 
                        id="tab1" 
                        value="tab1"
                        onChange={switchTab}
                        checked={currentTab === "tab1"}
                        aria-controls="people"
                    />
                    <label htmlFor="tab1">People</label>
                    <input 
                        type="radio" 
                        name="tabset" 
                        id="tab2" 
                        value="tab2"
                        onChange={switchTab}
                        checked={currentTab === "tab2"}
                        aria-controls="friends" 
                    />
                    <label htmlFor="tab2">Friends</label>
                </div>
                <div className="users__tab-panels">
                    {
                        (currentTab === 'tab1' && users) && (
                            <div id="people" className="users__tab-panel">
                                <Users 
                                    filteredUsers={users}
                                />
                            </div>
                        )
                    }
                    {
                        currentTab === 'tab2' && (
                            <div id="friends" className="users__tab-panel">
                                <Users 
                                    filteredUsers={getUserFriends()}
                                />
                            </div>
                        )
                    }
                </div>
            </section>
            <section  className="users--right-section">

            </section>
        </div>
        </MainLayout>
        
    )
}

const populates = [
	{
		child: 'friends',
		root: 'users'
	},
]


