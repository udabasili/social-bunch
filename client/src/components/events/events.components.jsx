import React, { Component } from 'react';
import Calendar from 'react-calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {createEvent, 
        getAllEvents, 
        joinEvent, 
        leaveEvent, 
        deleteEvent} from "../../nodeserver/node.utils";
import {connect} from "react-redux";
import ModalWindow from "../modal-window/modal-window.component";

class Events extends Component {
    state={
        eventName:"",
        time:"",
        date:"",
        showModal: false

    }
    componentDidMount(){
      this.props.getAllEvents()
    }

    getDate = (e) =>{
        let date = new Date(e)     
        this.setState({date: date})
    }
    toggleModal = (showModal) =>{
      this.setState({showModal: showModal},
        ()=>this.props.getAllEvents())
      
    }

    onChangeHandle = (e) =>{
        this.setState({[e.target.name]:e.target.value })
    }

    onSubmitHandler = (e) =>{
      e.preventDefault()
      const event = this.state
      this.props.addEvent(event)
      this.setState({showModal:false})
        
    }
    
  render() {
    const{
      allEvents, 
      currentUser,
      deleteEvent,
      joinEvent,
      leaveEvent} = this.props;

    return (
      <div className="event">  
        <button className="add-button" onClick={()=> this.toggleModal(true)} >
          Add Event
        </button>
        {allEvents && 
          <ul className="event__list">
            {allEvents.map((event)=>(
              <div className="card__container">
                <div className="card__content">
                { event.createdBy === currentUser.username &&
                  <FontAwesomeIcon 
                    onClick = {()=>deleteEvent(event._id)}
                    className="close-button icon-custom"
                    icon={faTimes}/>
                }
                  <img 
                    src={`https://robohash.org/${event.eventName}`} 
                    alt="event profile"/>
                    <div className="card__text-content">
                      <h1 className="primary-header">{event.eventName}</h1>
                      <h3 className="card__date-time">
                        <span>Time: {event.time}</span>
                        <span>Date: {event.date.split("T")[0]}</span>
                      </h3>
                      <ul>
                        <h3>Attenders</h3>
                        {event.attenders.map((attender)=>(
                          <li>{attender}</li>
                        ))}
                      </ul>
                    </div>
                    <button  className="card__join-button">
                    {
                      (event.attenders.includes(currentUser.username))?
                      <span onClick={() =>leaveEvent(event._id)}>Leave Event</span>:
                      <span onClick={() =>joinEvent(event._id)}>Join Event</span>

                    }
                    </button>
                  </div>
                </div>
            ))
          }
        </ul>
        }
        {this.state.showModal && 
            <ModalWindow closeHandler={this.toggleModal} >
              <Calendar onChange={this.getDate}
              />
              <form onSubmit={this.onSubmitHandler}>
                <label className="event__label" for="event-name">Event Name</label>
                <input type="text" className="event__input" onChange={this.onChangeHandle} name="eventName" placeholder="Your name.."/>
                <label className="event__label" for="time">Time</label>
                <input type="time" className="event__input" name="time" onChange={this.onChangeHandle} />
                <input type="submit" className="form-submit-button" value="Submit"/>
              </form>
          </ModalWindow>
        }
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) =>({
  addEvent: event => dispatch(createEvent(event)),
  joinEvent: event => dispatch(joinEvent(event)),
  leaveEvent: event => dispatch(leaveEvent(event)),
  deleteEvent: event => dispatch(deleteEvent(event)),
  getAllEvents: () => dispatch(getAllEvents()),

})

const mapStateToProps = (state) =>({
  allEvents: state.events.events,
  currentUser:state.user.currentUser

})

export default connect(mapStateToProps, mapDispatchToProps)(Events);
