import React from 'react'
import { NavLink } from 'react-router-dom'
import { UseGetUsers } from '../api/getAllUsers'
import { Loader } from '@/components/Elements'

function SuggestedPeople() {

    const { users, isLoading} = UseGetUsers()

    if (isLoading) return <Loader/>
    return (
        <div className="suggested-people home-card">
            <div className="home-card__header">
                Suggested People
            </div>
            <ul className="home-card__list">
                {
                        users?.filter((user, i) => i < 3).map((user) => (
                            <li className="home-card__item" key={user.uid}>
                                <div className="avatar">
                                    <img src={
                                        user.image || "https://img.icons8.com/ios/50/000000/user-male-circle.png"
                                    } 
                                        alt={user.username} />
                                </div>
                                <span className="username">
                                    {user.username}
                                </span>
                            </li>
                        ))
                    
                }
            </ul>
            <NavLink className="notification-dropdown__footer" to='/users' >
                View All
            </NavLink>
        </div>
    )
}

export default SuggestedPeople