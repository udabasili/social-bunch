import React, {useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RiAddLine } from 'react-icons/ri';
import { ICON_MAP } from '../icons-map';

const EventList = ({
    showModalHandler,
    events,
    selectEventHandler
    }) => {

    const [selectedEvent, setSelectedEvent] = useState('')

    const setSelectedEventHandler = (e) => {
        setSelectedEvent(e.target.value)
        selectEventHandler(e.target.value)
    }

    useEffect(() => {
        if(events.length > 0){
            let firstElement = events[0];
            setSelectedEvent(firstElement._id)
            selectEventHandler(firstElement._id)
        }

    }, [])

    return (
        <div className="event-list">
            <button  
                onClick={() => showModalHandler(true)}
                className="event-list__add button--wide button">
                    <span className='icon'>
                        <RiAddLine/>
                    </span>
                    <span>Add</span>
            </button>
            <div className="event-list__list">
                {
                    events.map((event) => (
                        <React.Fragment key={event._id}>
                            <input
                                type="radio"
                                name="event-list"
                                className="event-list__input"
                                id={event._id}
                                value={event._id}
                                onChange={setSelectedEventHandler}
                                checked={ selectedEvent === event._id}
                            />
                            <label 
                                className="event-list__item" 
                                htmlFor={event._id}
                                >
                                <span className='icon'>
                                    {
                                        ICON_MAP[event.category]
                                    }
                                </span>
                                <span className='event-name'>
                                    {event.eventName}
                                </span>
                            </label>
                        </React.Fragment>
                        
                    ))
                }
            </div>
        </div>
    )
}

EventList.propTypes = {
    showModalHandler: PropTypes.object,
    events: PropTypes.array,
    selectEventHandler: PropTypes.any
}

const mapStateToProps = (state) => ({
    events: state.events.events
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(EventList
)
