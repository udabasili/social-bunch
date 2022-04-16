import React, { useState } from 'react'
import { IoPeopleCircleSharp } from 'react-icons/io5';
import { useLeaveEvent } from '../api/leaveEvent';
import { EventAttributes } from '../type';
import { useDeleteEvent } from '../api/deleteEvent';
import { useJoinEvent } from '../api/joinEvent';
import { useAuth } from '@/lib/auth';
import { UseGetEvents } from '../api/getEvents';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import Image from '@/assets/images/zane-lee-zEpsostRYTg-unsplash.jpg'
import Skeleton from 'react-loading-skeleton'
import ImageError from '@/assets/images/no-image.png'

type EventDetailsProps = {
    event: EventAttributes
    selectEventHandler: (e: EventAttributes | null) => void

}
export const EventDetails = ({
    event,
    selectEventHandler
    }: EventDetailsProps) => {

    const { eventItem , eventItemLoading } = UseGetEvents(event.id)
    const { leaveEventFn } = useLeaveEvent(event.id)
    const { deleteEventFn } = useDeleteEvent(event.id)
    const { joinEventFn } = useJoinEvent(event.id)
    const { currentUser} = useAuth()
    const [imageLoading, setImageLoading] = useState(true)

    const prefix = (value: number) => {
        if(value > 1){
            return `${value} members`
        }else{
            return `${value} member`
        }
    }

    const deleteEventHandler = async () => {
        deleteEventFn()
        selectEventHandler(null)
    }

    if (eventItemLoading) return <FullScreenLoader/>

    const checkEventAttenders = () => {
        if(Array.isArray(eventItem?.attenders)) {
            return eventItem?.attenders.filter((user) => {
                return user.uid === currentUser.uid
            }).length === 0
        }
    }

    return (
        <section className="event-details">
            {
                (eventItem && eventItem !== undefined) && (
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
                                src={Image} 
                                loading="lazy"
                                onLoad={() => setImageLoading(false)}
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src=ImageError;
                                    currentTarget.style.width= "15rem"
                                    currentTarget.style.justifySelf= "center"
                                    setImageLoading(false)
                                }}
                                alt={eventItem.eventName}/>
                        
                            </>
                            <img src={Image} alt={eventItem.eventName} loading="lazy"/>
                        </div>
                        <time dateTime={new Date(eventItem.date.seconds * 1000).toDateString()} className="event-details__calender">
                            <em>
                                {
                                    new Date(eventItem.date.seconds * 1000).toLocaleString('default', {
                                        day: 'numeric'
                                    })
                                }
                            </em>
                            < strong > {
                                    new Date(eventItem.date.seconds * 1000)
                                    .toLocaleString('default',{
                                        month: 'long'
                                    })
                            }</strong>
                            <span>{new Date(eventItem.date.seconds * 1000).getFullYear()}</span>
                        </time>
                        <div className="event-details__information">
                            <span className='date-time'>
                                <span>
                                    {new Date(eventItem.date.seconds * 1000).toDateString()}
                                </span>
                                <span>
                                    {eventItem.time}
                                </span>
                            </span>
                            <h1 className='primary-header'>
                                {eventItem.eventName}
                            </h1>
                            <h3 className='tertiary-header'>
                                {eventItem.category}
                            </h3>
                            <div className="event-details__buttons">

                                {   
                                    checkEventAttenders() ? 
                                    (
                                        <button 
                                            onClick={() => joinEventFn(currentUser)}
                                            className="button button--submit ">
                                            Join Event
                                        </button>
                                    ) :
                                    (
                                    <button 
                                        onClick={() => leaveEventFn(currentUser)}
                                        className="button button--submit leave">
                                        Leave Event
                                    </button>
                                    )
                                }
                                {
                                    currentUser.uid === eventItem.createdBy.uid && (
                                        <button 
                                            onClick={deleteEventHandler}
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
                                    {eventItem.eventDescription}
                                </p>
                                <ul className="event-card__list">
                                    <li className="event-card__item">
                                        < IoPeopleCircleSharp/>
                                        {
                                            eventItem.attenders.length > 0 && (
                                                <span>{prefix(eventItem.attenders.length)}</span>
                                            )
                                        }
                                    </li>
                                </ul>
                            </div>
                            <div className="event-card event-card--attenders">
                                <h3 className='tertiary-header'>
                                    Attenders
                                </h3>
                                {
                                    eventItem.attenders.length > 0 && (
                                        eventItem.attenders.map((user) => (
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
                                    Host
                                </h3>
                                <div className="users__item">
                                    <div className="avatar">
                                        < img src = {
                                            eventItem.createdBy.image
                                        }
                                        alt = {
                                            eventItem.createdBy.username
                                        }
                                        />
                                    </div>
                                    <span className="username">
                                        {eventItem.createdBy.username}
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


export default EventDetails
