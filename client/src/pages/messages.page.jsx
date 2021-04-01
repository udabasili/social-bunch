import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ChatWindow from '../components/chat/chat-window.component'
import UserProfile from '../components/chat/user-profile.component'
import UserList from '../components/chat/user-list.component'
import Socket from '../services/chat-client';
import { getMessages, setReadMessages } from '../redux/message/message.action'
import { setAllUsers } from '../redux/users/users.action'


class MessagePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedUser: null,
            messages: []
        }
    }

    componentDidMount(){
        this.socket = new Socket()
        this.socket.usersListener(this.usersListenerFunction)
        this.socket.privateMessageListener(this.privateMessageListenerFunction)
    }

    componentDidUpdate(prevProps, prevState){
        if (this.state.selectedUser !== prevState.selectedUser){
            getMessages(
                this.props.currentUser._id,
                this.state.selectedUser._id,
            ).then((response) =>{
                this.setState(prevState => ({
                    ...prevState,
                    messages: response
                }))
            })
        }
    }

    componentWillUnmount() {
        this.socket.UnregisterPrivateMessageListener()
        this.socket.UnregisterUsersListener(this.usersListenerFunction)
    }

    static propTypes = {
        setAllUsers: PropTypes.func
    }

    usersListenerFunction = (response) => {
        this.props.setAllUsers(response.payload)
    }

    privateMessageListenerFunction = (data) => {
        const messages = data.messages;
        if (data.from === undefined || data.from === this.props.currentUser._id) {
            this.setState(prevState => ({
                ...prevState,
                messages,
            }))
            return;
        }
        const selectedUser = this.props.users.filter(user => user._id === data.from)[0]
        this.props.setReadMessages(data.from)
        this.setState(prevState => ({
            ...prevState,
            messages,
            selectedUser
        }))
    }

    pushMessage = (message) => {
        this.setState(prevState => ({
            ...prevState,
            messages:[
                ...prevState.messages,
                {
                    ...message,
                    status: 'sending'
                }
            ]
        }))
    }

    selectUserHandler = (user) => {
        console.log(user)
        this.setState((prevState) => ({
            ...prevState,
            selectedUser: user
        }))
    }

    render() {
        return (
            <div className="messages-page">
              <UserList
                selectUserHandler={this.selectUserHandler}
              />
              {
                  this.state.selectedUser && (
                    <React.Fragment>
                        <ChatWindow
                            user={this.state.selectedUser}
                            pushMessage={this.pushMessage}
                            messages={this.state.messages}
                        />
                        <UserProfile
                            user={this.state.selectedUser}
                        />
                    </React.Fragment>
                  )
              }
              
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
    users: state.users.allUsers,


})

const mapDispatchToProps = {
    setAllUsers,
    setReadMessages
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagePage)