import React from 'react';
import LeftNav from '../left-nav/left-nav.components';
import Contacts from '../contacts/contact.component';
import UserMessageHistory from '../user-message-history/user-message-history.component';
import Group from '../groups/group.component';
import Users from '../users/users.component';
import Events from '../events/events.components';
import {connect} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { getMessages } from '../../redux/action/message.action';


class ChatroomLeftSection extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      currentLink:'messages',
      showUserMessages: false,
      isMobile: window.innerWidth <= 900 ? true : false,
      leftSectionStyling:{
        marginLeft: '0',
        iconType: faMinusCircle,
        cursor: 'pointer'
      },
      hideLeftSection: false,
        };
    }
    
    componentDidMount(){
      window.addEventListener('resize', this.setIsMobile)
    }

    componentWillUnmount(){
      window.removeEventListener('resize', this.setIsMobile)

    }

    setIsMobile = () =>{
      this.setState((prevState) => ({
        ...prevState,
        isMobile: window.innerWidth <= 900
      }))
    }

    toggleLeftSection = (hide) => {
      let leftMargin = hide;
      let icon = '';
      if(hide){
        leftMargin = '-92vw'
        icon = faPlusCircle
      }
      else{
        leftMargin = '0'
        icon = faMinusCircle
      }
      this.setState((prevState)=>({
        ...prevState,
          hideLeftSection:!prevState.hideLeftSection,
          leftSectionStyling: {
            ...prevState.leftSectionStyling,
            marginLeft: leftMargin,
            iconType: icon
              }
          })
        )
    }
 
    showUserMessagesHandler = (friend) => {         
      this.props.getMessages(this.props.currentUser._id, friend._id)
          .then(() => {
            this.props.setFriendHandler(friend)
              this.setState((prevState) => ({
          ...prevState,
          showUserMessages: true,
          friend:friend,
          }),this.toggleLeftSection(true))
        })       
    }

    toggleModal = (value) =>{
      this.setState((prevState) => ({
        ...prevState,
        showModal: value
        })
      )
    }

  navLinkChangeHandler = (value) =>{    
    this.setState({currentLink: value}, this.toggleLeftSection(false))
  }

  navComponents = () =>{
    switch (this.state.currentLink) {
      case 'messages':
        return (
          <React.Fragment>
              <div className='chatroom__left-section__header'>
                <h1 className='primary-header'>Contacts</h1>
                {this.state.isMobile && (
                <FontAwesomeIcon color='#0EBD60' className='switch' onClick={() => {
                      this.toggleLeftSection(!this.state.hideLeftSection)}
                    }
                icon={this.state.leftSectionStyling.iconType}/>)}
              </div>
            <Contacts />
            <UserMessageHistory showMessages={this.showUserMessagesHandler} />
          </React.Fragment>
        )  
      case 'events':
        return (
          <React.Fragment>
              <div className='chatroom__left-section__header'>
                <h1 className='primary-header'>Events</h1>
                {this.state.isMobile && (
                <FontAwesomeIcon color='#0EBD60' className='switch' onClick={() => {
                      this.toggleLeftSection(!this.state.hideLeftSection)}
                    }
                icon={this.state.leftSectionStyling.iconType}/>)}
              </div>
              <Events/>
          </React.Fragment>
        )
      case 'groups':
        return (
          <React.Fragment>
            <div className='chatroom__left-section__header'>
                <h1 className='primary-header'>Groups</h1>
                {this.state.isMobile && (
                <FontAwesomeIcon color='#0EBD60' className='switch' onClick={() => {
                      this.toggleLeftSection(!this.state.hideLeftSection)}
                    }
                icon={this.state.leftSectionStyling.iconType}/>)}
              </div>
            <Group/>
          </React.Fragment>
        ) 
      case 'users':
        return (
          <React.Fragment>
          <div className='chatroom__left-section__header'>
                <h1 className='primary-header'>Users</h1>
                {this.state.isMobile && (
                <FontAwesomeIcon color='#0EBD60' className='switch' onClick={() => {
                      this.toggleLeftSection(!this.state.hideLeftSection)}
                    }
                icon={this.state.leftSectionStyling.iconType}/>)}
            </div>
          <Users/>
      </React.Fragment>
            )  
      default:
        return;
    }
  }  


  render() {
    return (
      <React.Fragment>
          <LeftNav 
            navLinkChangeHandler={this.navLinkChangeHandler}  
            className='navigation'/>
            <div className='chatroom__left-section' style={this.state.isMobile ? this.state.leftSectionStyling : {}}>
              {this.navComponents()}
            </div>            
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) =>({
  currentUser:state.user.currentUser,
  errors : state.errors,
  allUsers: state.user.users,

})

const mapDispatchToProps = dispatch => ({
  getMessages: (userId, recipientId) => dispatch(getMessages(userId, recipientId))
})



export default connect(mapStateToProps , mapDispatchToProps)(ChatroomLeftSection);