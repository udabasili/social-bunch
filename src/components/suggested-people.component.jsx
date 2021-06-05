import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

function SuggestedPeople({ users }) {
    return (
        <div className="suggested-people home-card">
            <div className="home-card__header">
                Suggested People
            </div>
            <ul className="home-card__list">
                {
                    users.length > 0 && (
                        users.filter((user, i) => i < 3).map((user) => (
                            <li className="home-card__item" key={user._id}>
                                <div className="avatar">
                                    <img src={user.image} alt={user.username} />
                                </div>
                                <span className="username">
                                    {user.username}
                                </span>
                            </li>
                        ))
                    )
                }
            </ul>
            <NavLink className="notification-dropdown__footer" to='/users' >
                View All
            </NavLink>
        </div>
    )
}

SuggestedPeople.propTypes = {
    users: PropTypes.array
}



export default SuggestedPeople