import { NavLink } from 'react-router-dom'
import { UseGetEvents } from '../api/getEvents'
import { ICON_MAP } from '@/data/iconMap';
import { Loader } from '@/components/Elements';

function EventsSummary() {

    const { events, isLoading } = UseGetEvents()

    if (isLoading) return <Loader/>

    return (
        <div className="stories-summary home-card">
            <div className="home-card__header">
                Suggested Events
            </div>
            <ul className="home-card__list">
                {
                        events?.filter((event, i) => i < 3).map((event) => (
                            <li className="home-card__item" key={event.id}>
                                <span className='icon'>
                                    {
                                        ICON_MAP[event.category]
                                    }
                                </span>
                                <span className="username">
                                    {event.eventName}
                                </span>
                            </li>
                        ))
                    
                }
            </ul>
            <NavLink className="notification-dropdown__footer" to='/events' >
                View All
            </NavLink>
        </div>
    )
}

export default EventsSummary