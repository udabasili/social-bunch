import React from 'react'
import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { IoPeopleCircleSharp } from 'react-icons/io5';

import { 
    joinGroup,
    leaveGroup,
    deleteGroup
} from '../../redux/groups/group.action';


export const GroupDetails = ({
    groupId,
    groups,
    currentUser,
    joinGroup,
    leaveGroup,
    deleteGroup
    }) => {

    const prefix = (value) => {
        if(value > 1){
            return `${value} members`
        }else{
            return `${value} member`
        }
    }
    
    const groupSelector = createSelector(
        state => state.groups.groups,
        groups => (
            groups.filter((group) => (
                group._id === groupId
            ))
        )
    )

    const filteredGroup = useSelector(groupSelector)[0]
    const checkGroupMembers = () => {
        return filteredGroup.members.filter((user) => (
            user._id === currentUser._id
        )).length === 0
    }

    return (
        <section className="event-details">
            {
                (filteredGroup && filteredGroup !== undefined) && (
                    <React.Fragment>
                        <div className="event-details__cover">
                            <img src={filteredGroup.imageUrl} alt={filteredGroup.groupName}/>
                        </div>
                        <div className="event-details__information">
                            <h1 className='primary-header'>
                                {filteredGroup.groupName}
                            </h1>
                            <h3 className='tertiary-header'>
                                {filteredGroup.category}
                            </h3>
                            <div className="event-details__buttons">

                                {   
                                    checkGroupMembers() ? 
                                    (
                                        <button 
                                            onClick={() => joinGroup(filteredGroup._id)}
                                            className="button button--submit ">
                                            Join Group
                                        </button>
                                    ) :
                                    (
                                    <button 
                                        onClick={() => leaveGroup(filteredGroup._id)}
                                        className="button button--submit leave">
                                        Leave Group
                                    </button>
                                    )
                                }
                                {
                                    currentUser.id === filteredGroup.createdBy.id && (
                                        <button 
                                            onClick={() => deleteGroup(filteredGroup._id)}
                                            className="button button--submit leave">
                                            Delete
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                        <div className="event-details__cards">
                            <div className="event-card event-card--detail">
                                <h3 className='tertiary-header'>
                                    Details
                                </h3>
                                <p className='paragraph'>
                                    {filteredGroup.description}
                                </p>
                                <ul className="event-card__list">
                                    <li className="event-card__item">
                                        < IoPeopleCircleSharp/>
                                        {
                                            filteredGroup.members.length > 0 && (
                                                <span>{prefix(filteredGroup.members.length)}</span>
                                            )
                                        }
                                    </li>
                                </ul>
                            </div>
                            <div className="event-card event-card--members">
                                <h3 className='tertiary-header'>
                                    Members
                                </h3>
                                {
                                    filteredGroup.members.length > 0 && (
                                        filteredGroup.members.map((user) => (
                                            <li className="users__item" key={user._id}>
                                                <div className="avatar">
                                                    <img src={user.userImage} alt={user.username} />
                                                </div>
                                                <span className="username">
                                                    {user.username}
                                                </span>
                                            </li>
                                        ))
                                    )
                                }
                            </div>
                            <div className="event-card event-card--host">
                                <h3 className='tertiary-header'>
                                    Group Admin
                                </h3>
                                <div className="users__item">
                                    <div className="avatar">
                                        < img src = {
                                            filteredGroup.createdBy.userImage
                                        }
                                        alt = {
                                            filteredGroup.createdBy.username
                                        }
                                        />
                                    </div>
                                    <span className="username">
                                        {filteredGroup.createdBy.username}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                    
                )
            }
        </section>
    )
}

GroupDetails.propTypes = {
    groups: PropTypes.array,
    currentUser: PropTypes.object,
    leaveGroup: PropTypes.func,
    joinGroup: PropTypes.func,
    deleteGroup: PropTypes.func
}

const mapStateToProps = (state) => ({
    groups: state.groups.groups,
    currentUser: state.user.currentUser,
})


const mapDispatchToProps = {
    joinGroup,
    leaveGroup,
    deleteGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetails)
