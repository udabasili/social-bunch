import React, { Component } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {createEvent, 
        getAllEvents, 
        joinEvent, 
        leaveEvent, 
        deleteEvent} from '../redux/action/event.action';
import {connect} from 'react-redux';
import ModalWindow from './modal-window.component';
import FormInput from './form-input.component';
import { isMobile } from 'react-device-detect';

/**
  * @desc handles showing the adding of events by user, leaving, joining and deleting events 
  * @author Udendu Abasili

*/
class Events extends Component {
    constructor (props) {
      super(props);
      this.state = {
        eventName:'',
        time:'',
        date:'',
        createdBy:props.currentUser.username,
        showModal: false
      }
    }
    
    componentDidMount(){
      this.props.getAllEvents()
    }

    getDate = (e) =>{
        let date = new Date(e)     
        this.setState({date: date})
    }

//switch profile window off and on
    toggleModal = (showModal) =>{
	  this.setState({showModal: showModal})
	}

    onChangeHandle = (e) =>{
        this.setState({[e.target.name]:e.target.value })
    }

    onSubmitHandler = (e) =>{
      e.preventDefault()
      const event = this.state
      this.props.addEvent(event)
      this.setState({showModal:false})
      this.setState((prevState) => ({
        ...prevState,
        eventName:'',
        time:'',
        date:'',
        }
      ))
    }
    

	render() {
		const{
		allEvents, 
		currentUser,
		deleteEvent,
		joinEvent,
		leaveEvent } = this.props;

		const {eventName, time, } = this.state
		return (
		<div className='event'>  
			<button className='add-button' onClick={()=> this.toggleModal(true)} >
			Add
			</button>
			{allEvents && 
			<ul className='event__list'>
				{allEvents.map((event)=>(
				<div className='card'>
					{ event.createdBy === currentUser.username &&
						<FontAwesomeIcon 
						onClick = {()=>deleteEvent(event._id)}
						className='close-button icon-custom'
						icon={faTimes}/>
						}
							<h1 className='card__header'>{event.eventName}</h1>
						<div className="card__details">
							<div className="card__item">
								<span className="label">Date : </span>
								<span className="data">{event.date.split('T')[0]}</span>
							</div>
							<div className="card__item">
								<span className="label">Time : </span>
								<span className="data">{event.time }</span>
							</div><div className="card__item">
								<span className="label">Created By : </span>
								<span className="data">{event.createdBy}</span>
							</div>
							{event.attenders.includes(currentUser.username) ?
								<button className='form-submit-button' onClick={() => leaveEvent(event._id)}>
									Leave
								</button>
								: <button className='form-submit-button' onClick={() => joinEvent(event._id)}>
									<span >Join </span>
								</button>
							}
						</div>
						
					</div>
				))
			}
			</ul>
			}
			{this.state.showModal && 
				<ModalWindow closeHandler={() =>this.toggleModal(false)} >
				<Calendar onChange={this.getDate} 
				/>
				<form onSubmit={this.onSubmitHandler}>
					<FormInput
						label='Event name'
						name='eventName'
						handleChange={this.onChangeHandle}
						type='text'
						isMobile={isMobile}
						value={eventName}
						placeholder='Input the event name'
						required />
					<FormInput
						label='Time'
						name='time'
						handleChange={this.onChangeHandle}
						type='time'
						isMobile={isMobile}
						placeholder='Input the event time'
						value={time}
						required />      
					<input type='submit' className='form-submit-button' value='Submit'/>
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
