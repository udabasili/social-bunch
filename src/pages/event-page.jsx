import React, { Component } from 'react'
import PropTypes from 'prop-types'
import EventDetails from '../components/events/event-details.component'
import EventList from '../components/events/event-list.component'
import Modal from '../components/modal.component'
import EventForm from '../components/events/event-form.component'

class EventPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            showModal: false,
            currentSelected: null
        }
    }

    static propTypes = {
        setEvents: PropTypes.func,

    }

    showModalHandler = (show) => {
        this.setState((prevState) => ({
            ...prevState,
            showModal: show
        }))
    }

    selectEventHandler = (eventId) =>{
        this.setState((prevState) => ({
            ...prevState,
            currentSelected: eventId
        }))
    }

    render() {
        const { showModal, currentSelected } = this.state;
        return (
            <div className='events-page'>
                {
                    showModal && (
                        <Modal>
                            <EventForm
                                showModalHandler={this.showModalHandler}
                            />
                        </Modal>
                    )
                }
                <EventList
                    showModalHandler={this.showModalHandler}
                    selectEventHandler={this.selectEventHandler}
                    />
                <EventDetails
                    eventId={currentSelected}
                />
            </div>
        )
    }
}



export default EventPage;

