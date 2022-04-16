import React, {useState, useEffect } from 'react'
import { RiAddLine } from 'react-icons/ri';
import { UseGetEvents } from '../api/getEvents';
import { ICON_MAP } from '@/data/iconMap';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { EventAttributes } from '../type';

interface Props {
    showModalHandler:  (show: boolean) => void
    selectEventHandler: (e: EventAttributes) => void
}

const EventList = ({
    showModalHandler,
    selectEventHandler
    }: Props) => {

    const [selectedEvent, setSelectedEvent] = useState('')
    const { events, isLoading } = UseGetEvents()

    const setSelectedEventHandler = (event: EventAttributes) => {
        setSelectedEvent(event.id)
        selectEventHandler(event)
    }


    useEffect(() => {
        if(events && events.length > 0){
            let firstElement = events[0];
            setSelectedEvent(firstElement.id)
            selectEventHandler(firstElement)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (isLoading) return <FullScreenLoader/>


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
                    events?.map((event) => (
                        <React.Fragment key={event.id}>
                            <input
                                type="radio"
                                name="event-list"
                                className="event-list__input"
                                id={event.id}
                                value={event.id}
                                onChange={() => setSelectedEventHandler(event)}
                                checked={ selectedEvent === event.id}
                            />
                            <label 
                                className="event-list__item" 
                                htmlFor={event.id}
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

export default EventList
