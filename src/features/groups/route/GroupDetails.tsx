import React, { useState } from 'react'
import { IoPeopleCircleSharp } from 'react-icons/io5';
import { useLeaveGroup } from '../api/leaveGroup';
import { GroupAttributes } from '../type';
import { useDeleteGroup } from '../api/deleteGroup';
import { useJoinGroup } from '../api/joinGroup';
import { useAuth } from '@/lib/auth';
import { UseGetGroups } from '../api/getGroup';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import Skeleton from 'react-loading-skeleton'
import ImageError from '@/assets/images/no-image.png'

type GroupDetailsProps = {
    group: GroupAttributes
    selectGroupHandler: (e: GroupAttributes | null) => void

}
export const GroupDetails = ({
    group,
    selectGroupHandler
    }: GroupDetailsProps) => {

    const { groupPicked , groupLoading } = UseGetGroups(group.id)
    const { leaveGroupFn } = useLeaveGroup(group.id)
    const { deleteGroupFn } = useDeleteGroup(group.id)
    const [imageLoading, setImageLoading] = useState(true)
    const { joinGroupFn } = useJoinGroup(group.id)
    const { currentUser} = useAuth()

    const prefix = (value: number) => {
        if(value > 1){
            return `${value} members`
        }else{
            return `${value} member`
        }
    }
 
    if (groupLoading) return <FullScreenLoader/>

    const deleteGroupHandler = async () => {
        deleteGroupFn()
        selectGroupHandler(null)
    }


    const checkGroupMembers = () => {
        if(Array.isArray(groupPicked?.members)) {
            return groupPicked?.members.filter((user) => {
                return user.uid === currentUser.uid
            }).length === 0
        }
        
    }

    return (
        <section className="event-details">
            {
                groupPicked  && (
                    <React.Fragment>
                        <div className="event-details__cover">
                        <>
                            {
                                imageLoading && (
                                    <Skeleton
                                        height="100%"
                                        duration={1}
                                        containerClassName="avatar-skeleton"
                                    />
                                )
                            }
                            <img 
                                src={groupPicked.imageUrl} 
                                loading="lazy"
                                onLoad={() => setImageLoading(false)}
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src=ImageError;
                                    currentTarget.style.width= "15rem"
                                    currentTarget.style.justifySelf= "center"
                                    setImageLoading(false)
                                }}
                                alt={groupPicked.groupName}/>
                        
                            </>
                            
                        </div>
                        <div className="event-details__information">
                            <h1 className='primary-header'>
                                {groupPicked.groupName}
                            </h1>
                            <h3 className='tertiary-header'>
                                {groupPicked.category}
                            </h3>
                            <div className="event-details__buttons">

                                {   
                                    checkGroupMembers() ? 
                                    (
                                        <button 
                                            onClick={() => joinGroupFn(currentUser)}
                                            className="button button--submit ">
                                            Join Group
                                        </button>
                                    ) :
                                    (
                                    <button 
                                        onClick={() => leaveGroupFn(currentUser)}
                                        className="button button--submit leave">
                                        Leave Group
                                    </button>
                                    )
                                }
                                {
                                    currentUser.uid === groupPicked.createdBy.uid && (
                                        <button 
                                            onClick={deleteGroupHandler}
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
                                    {groupPicked.description}
                                </p>
                                <ul className="event-card__list">
                                    <li className="event-card__item">
                                        < IoPeopleCircleSharp/>
                                        {
                                            groupPicked.members.length > 0 && (
                                                <span>{prefix(groupPicked.members.length)}</span>
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
                                    groupPicked.members.length > 0 && (
                                        groupPicked.members.map((user) => (
                                            <li className="users__item" key={user.uid}>
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
                                            groupPicked.createdBy.image
                                        }
                                        alt = {
                                            groupPicked.createdBy.username
                                        }
                                        />
                                    </div>
                                    <span className="username">
                                        {groupPicked.createdBy.username}
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


export default GroupDetails
