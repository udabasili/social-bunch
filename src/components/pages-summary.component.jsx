import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ICON_MAP } from './icons-map'
import { NavLink } from 'react-router-dom'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux';


const groupPopulates = [{
        child: 'members',
        root: 'users'
    },
    {
        child: 'createdBy',
        root: 'users'
    }
]

function PagesSummary({ groups }) {
    
    return (
        <div className="pages-summary home-card">
            <div className="home-card__header">
                Suggested Groups
            </div>
            <ul className="home-card__list">
                {
                    groups.length > 0 && (
                        groups.filter((group, i) => i < 3).map((group) => (
                            <li className="home-card__item" key={group._id}>
                                <span className='icon'>
                                    {
                                        ICON_MAP[group.category]
                                    }
                                </span>
                                <span className="username">
                                    {group.groupName}
                                </span>
                            </li>
                        ))
                    )
                }
            </ul>
            <NavLink className="notification-dropdown__footer" to='/groups' >
                View All
            </NavLink>
        </div>
    )
}

PagesSummary.propTypes = {
    groups: PropTypes.array
}

const mapStateToProps = (state) => {
    let data = state.firestore.data.groups
    let groups = [];
    if (data) {
        for (let key in data) {
            groups.push({
                _id: key,
                ...data[key]
            })
        }
    }

    return {
        groups
    }
}

export default compose(
    firestoreConnect((props) => [
        {
            collection: 'groups',
            populates: groupPopulates
        }

    ]),
    connect(mapStateToProps, null)
)(PagesSummary);
