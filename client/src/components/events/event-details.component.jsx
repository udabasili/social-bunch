import React from 'react'
import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import Image from '../../assets/images/zane-lee-zEpsostRYTg-unsplash.jpg'
import { IoPeopleCircleSharp } from 'react-icons/io5';
import { 
        joinEvent, 
        leaveEvent,
        deleteEvent
} from '../../redux/events/event.action';

export const EventDetails = ({
    eventId,
    currentUser,
    joinEvent,
    leaveEvent,
    deleteEvent
    }) => {

    const prefix = (value) => {
        if(value > 1){
            return `${value} people attending`
        }else{
            return `${value} person attending`
        }
    }
    
    const eventSelector = createSelector(
        state => state.events.events,
        events => (
            events.filter((event) => (
                event._id === eventId
            ))
        )
    )

    const filteredEvent = useSelector(eventSelector)[0]

    const checkEventAttenders = () => {
        return filteredEvent.attenders.filter((user) => (
            user._id === currentUser._id
        )).length === 0
    }

    return (
        <section className="event-details">
            {
                (filteredEvent && filteredEvent !== undefined) && (
                    <React.Fragment>
                        <div className="event-details__cover">
                            <img src={Image} alt={filteredEvent.eventName}/>
                        </div>
                        <time dateTime={new Date(filteredEvent.date).toDateString()} className="event-details__calender">
                            <em>
                                {
                                    new Date(filteredEvent.date).toLocaleString('default',{
                                        day: 'numeric'
                                    })
                                }
                            </em>
                            <strong>{new Date(filteredEvent.date)
                                    .toLocaleString('default',{
                                        month: 'long'
                                    })
                            }</strong>
                            <span>{new Date(filteredEvent.date).getFullYear()}</span>
                        </time>
                        <div className="event-details__information">
                            <span className='date-time'>
                                <span>
                                    {new Date(filteredEvent.date).toDateString()}
                                </span>
                                <span>
                                    {filteredEvent.time}
                                </span>
                            </span>
                            <h1 className='primary-header'>
                                {filteredEvent.eventName}
                            </h1>
                            <h3 className='tertiary-header'>
                                {filteredEvent.category}
                            </h3>
                            <div className="event-details__buttons">

                                {   
                                    checkEventAttenders() ? 
                                    (
                                        <button 
                                            onClick={() => joinEvent(filteredEvent._id)}
                                            className="button button--submit ">
                                            Join Event
                                        </button>
                                    ) :
                                    (
                                    <button 
                                        onClick={() => leaveEvent(filteredEvent._id)}
                                        className="button button--submit leave">
                                        Leave Event
                                    </button>
                                    )
                                }
                                {
                                    currentUser.id === filteredEvent.createdBy.id && (
                                        <button 
                                            onClick={() => deleteEvent(filteredEvent._id)}
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
                                    {filteredEvent.description}
                                </p>
                                <ul className="event-card__list">
                                    <li className="event-card__item">
                                        < IoPeopleCircleSharp/>
                                        {
                                            filteredEvent.attenders.length > 0 && (
                                                <span>{prefix(filteredEvent.attenders.length)}</span>
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
                                    filteredEvent.attenders.length > 0 && (
                                        filteredEvent.attenders.map((user) => (
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
                                    Host
                                </h3>
                                <div className="users__item">
                                    <div className="avatar">
                                        < img src = {
                                            filteredEvent.createdBy.userImage
                                        }
                                        alt = {
                                            filteredEvent.createdBy.username
                                        }
                                        />
                                    </div>
                                    <span className="username">
                                        {filteredEvent.createdBy.username}
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

const mapStateToProps = (state) => ({
    events: state.events.events,
    currentUser: state.user.currentUser,
})


const mapDispatchToProps = {
    joinEvent,
    leaveEvent,
    deleteEvent
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails)
