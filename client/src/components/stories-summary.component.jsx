import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ICON_MAP } from './icons-map'
import { NavLink } from 'react-router-dom'


function SummaryEvents({ events }) {
    return (
        <div className="stories-summary home-card">
            <div className="home-card__header">
                Suggested Events
            </div>
            <ul className="home-card__list">
                {
                    events.length > 0 && (
                        events.filter((event, i) => i < 3).map((event) => (
                            <li className="home-card__item" key={event._id}>
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
                    )
                }
            </ul>
            <NavLink className="notification-dropdown__footer" to='/events' >
                View All
            </NavLink>
        </div>
    )
}

SummaryEvents.propTypes = {
    events: PropTypes.array
}

const mapStateToProps = (state) => ({
    events: state.events.events

})

export default connect(mapStateToProps, null)(SummaryEvents)
