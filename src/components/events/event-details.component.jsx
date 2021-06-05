import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Image from '../../assets/images/zane-lee-zEpsostRYTg-unsplash.jpg'
import { IoPeopleCircleSharp } from 'react-icons/io5';
import { 
        joinEvent, 
        leaveEvent,
        deleteEvent
} from '../../redux/events/event.action';
import {  populate } from 'react-redux-firebase'

const populates = [
    {
        child: 'attenders',
        root: 'users'
    },
    {
        child: 'createdBy',
        root: 'users'
    }
]


export const EventDetails = ({
    event,
    currentUser,
    joinEvent,
    leaveEvent,
    deleteEvent
    }) => {

    const prefix = (value) => {
        if (value > 1) {
            return `${value} people attending`
        } else {
            return `${value} person attending`
        }
    }

    const checkEventAttenders = () => {
        return event.attenders.filter((user) => {
            return user._id === currentUser._id
        }).length === 0
    }

    return (
        <section className="event-details">
            {
                (event && event !== undefined) && (
                    <React.Fragment>
                        <div className="event-details__cover">
                            <img src={Image} alt={event.eventName}/>
                        </div>
                        <time dateTime={new Date(event.date.seconds * 1000).toDateString()} className="event-details__calender">
                            <em>
                                {
                                    new Date(event.date.seconds * 1000).toLocaleString('default', {
                                        day: 'numeric'
                                    })
                                }
                            </em>
                            < strong > {
                                    new Date(event.date.seconds * 1000)
                                    .toLocaleString('default',{
                                        month: 'long'
                                    })
                            }</strong>
                            <span>{new Date(event.date.seconds * 1000).getFullYear()}</span>
                        </time>
                        <div className="event-details__information">
                            <span className='date-time'>
                                <span>
                                    {new Date(event.date.seconds * 1000).toDateString()}
                                </span>
                                <span>
                                    {event.time}
                                </span>
                            </span>
                            <h1 className='primary-header'>
                                {event.eventName}
                            </h1>
                            <h3 className='tertiary-header'>
                                {event.category}
                            </h3>
                            <div className="event-details__buttons">

                                {   
                                    checkEventAttenders() ? 
                                    (
                                        <button 
                                            onClick={() => joinEvent(event._id)}
                                            className="button button--submit ">
                                            Join Event
                                        </button>
                                    ) :
                                    (
                                    <button 
                                        onClick={() => leaveEvent(event._id)}
                                        className="button button--submit leave">
                                        Leave Event
                                    </button>
                                    )
                                }
                                {
                                    currentUser._id === event.createdBy._id && (
                                        <button 
                                            onClick={() => deleteEvent(event._id)}
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
                                    {event.description}
                                </p>
                                <ul className="event-card__list">
                                    <li className="event-card__item">
                                        < IoPeopleCircleSharp/>
                                        {
                                            event.attenders.length > 0 && (
                                                <span>{prefix(event.attenders.length)}</span>
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
                                    event.attenders.length > 0 && (
                                        event.attenders.map((user) => (
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
                                    Host
                                </h3>
                                <div className="users__item">
                                    <div className="avatar">
                                        < img src = {
                                            event.createdBy.image
                                        }
                                        alt = {
                                            event.createdBy.username
                                        }
                                        />
                                    </div>
                                    <span className="username">
                                        {event.createdBy.username}
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

EventDetails.propTypes = {
    events: PropTypes.array,
    currentUser: PropTypes.object,
    leaveEvent: PropTypes.func,
    joinEvent: PropTypes.func,
    deleteEvent: PropTypes.func
}


const mapStateToProps = (state, ownProps) => {
    const id = ownProps.eventId;
    const events = populate(state.firestore, 'events', populates)
    let event;
    if (events && events[id]) {
        let currentEvents = events[id];
        event = ({
            _id: id,
            ...currentEvents
        })
        
    } else {
        event = null
    }
    return {
        event,
        currentUser: state.user.currentUser,
}}


const mapDispatchToProps = {
    joinEvent,
    leaveEvent,
    deleteEvent
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails)
