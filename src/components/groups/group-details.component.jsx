import React from 'react'
import PropTypes from 'prop-types'
import { connect} from 'react-redux'
import { IoPeopleCircleSharp } from 'react-icons/io5';
import {  populate } from 'react-redux-firebase'
import { 
    joinGroup,
    leaveGroup,
    deleteGroup
} from '../../redux/groups/group.action';

const populates = [
    {
        child: 'members',
        root: 'users'
    },
    {
        child: 'createdBy',
        root: 'users'
    }
]

export const GroupDetails = ({
    group,
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
 

    const checkGroupMembers = () => {
        return group.members.filter((user) => {
            return user._id === currentUser._id
        }).length === 0
    }

    return (
        <section className="event-details">
            {
                (group && group !== undefined) && (
                    <React.Fragment>
                        <div className="event-details__cover">
                            <img src={group.imageUrl} alt={group.groupName}/>
                        </div>
                        <div className="event-details__information">
                            <h1 className='primary-header'>
                                {group.groupName}
                            </h1>
                            <h3 className='tertiary-header'>
                                {group.category}
                            </h3>
                            <div className="event-details__buttons">

                                {   
                                    checkGroupMembers() ? 
                                    (
                                        <button 
                                            onClick={() => joinGroup(group._id)}
                                            className="button button--submit ">
                                            Join Group
                                        </button>
                                    ) :
                                    (
                                    <button 
                                        onClick={() => leaveGroup(group._id)}
                                        className="button button--submit leave">
                                        Leave Group
                                    </button>
                                    )
                                }
                                {
                                    currentUser._id === group.createdBy._id && (
                                        <button 
                                            onClick={() => deleteGroup(group._id)}
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
                                    {group.description}
                                </p>
                                <ul className="event-card__list">
                                    <li className="event-card__item">
                                        < IoPeopleCircleSharp/>
                                        {
                                            group.members.length > 0 && (
                                                <span>{prefix(group.members.length)}</span>
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
                                    group.members.length > 0 && (
                                        group.members.map((user) => (
                                            <li className="users__item" key={user._id}>
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
                            </div>
                            <div className="event-card event-card--host">
                                <h3 className='tertiary-header'>
                                    Group Admin
                                </h3>
                                <div className="users__item">
                                    <div className="avatar">
                                        < img src = {
                                            group.createdBy.image
                                        }
                                        alt = {
                                            group.createdBy.username
                                        }
                                        />
                                    </div>
                                    <span className="username">
                                        {group.createdBy.username}
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

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.groupId;
    const groups = populate(state.firestore, 'groups', populates)
    let group;
    if (groups && groups[id]) {
        let currentGroup = groups[id];
        group = ({
            _id: id,
            ...currentGroup
        })
        
    } else {
        group = null
    }
    return {
        group,
        currentUser: state.user.currentUser,
}}


const mapDispatchToProps = {
    joinGroup,
    leaveGroup,
    deleteGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetails)
