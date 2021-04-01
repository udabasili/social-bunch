import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import EventDetails from '../components/events/event-details.component'
import EventList from '../components/events/event-list.component'
import Modal from '../components/modal.component'
import EventForm from '../components/events/event-form.component'
import {
    setEvents
} from '../redux/events/event.action';
import Socket from '../services/chat-client';

class EventPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            showModal: false,
            currentSelected: null
        }
    }

    socket = new Socket()

    static propTypes = {
        setEvents: PropTypes.func,

    }

    componentDidMount(){
        this.socket.eventsListener(this.eventListenerFunction)
    }

    componentWillUnmount(){
        this.socket.UnregisterEventsListener(this.eventListenerFunction)
    }

    showModalHandler = (show) => {
        this.setState((prevState) => ({
            ...prevState,
            showModal: show
        }))
    }

    eventListenerFunction = (response) => {
        this.props.setEvents(response.payload)
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

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    setEvents
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPage)
