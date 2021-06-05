import React, { Component } from 'react'
import { connect } from 'react-redux'
import ChatWindow from '../components/chat/chat-window.component'
import UserProfile from '../components/chat/user-profile.component'
import UserList from '../components/chat/user-list.component'
import { setReadMessages } from '../redux/message/message.action'
import { f } from '../services/firebase';

class MessagePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedUser: null,
            messages: []
        }
    }


    componentDidUpdate(prevProps, prevState){
        if (this.state.selectedUser !== prevState.selectedUser){
            const chatId = this.generateChatId(
                this.props.currentUser._id,
                this.state.selectedUser._id
            )
            const messageRef = f.database().ref('messages').child(chatId).orderByChild('createdAt').limitToLast(25)
            messageRef.on('value', snapshot => {
                const exists = snapshot.val() !== null;
                let messages = []
                const key = snapshot.key;
                let messagesData = snapshot.val()
                if(exists){ 
                    let recipient = key.split('_').filter(item => this.props.currentUser._id !== item)[0]
                    const selectedUser = this.props.users.filter(user => user._id === recipient)[0]
                    for(let k in messagesData){
                        let messageObject = messagesData[k]
                        messages.push({
                            _id: k,
                            ...messageObject

                        })
                    }
                    this.setState(prevState => ({
                        ...prevState,
                        messages,
                        selectedUser
                    }))
                
            }
        })
        }
    }

    generateChatId(sentUserId, currentUserId) {
        let keyArray = []
        keyArray.push(sentUserId)
        keyArray.push(currentUserId)
        keyArray.sort()
        return keyArray.join('_')
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
        this.setState((prevState) => ({
            ...prevState,
            selectedUser: user
        }))
    }

    render() {
        const { currentUser } = this.props;
        const { messages, selectedUser} = this.state;
        let chatId;
        if (selectedUser) {
            chatId = this.generateChatId(
                currentUser._id,
                selectedUser._id
            )
        }
        return (
            <div className="messages-page">
              <UserList
                    selectUserHandler={this.selectUserHandler}
                    currentUser={currentUser}
                    chatId={chatId}
              />
              {
                  this.state.selectedUser && (
                    <React.Fragment>
                        <ChatWindow
                            user={selectedUser}
                            pushMessage={this.pushMessage}
                            messages={messages}
                            currentUser={currentUser}
                        />
                        <UserProfile
                            user={selectedUser}
                            currentUser={currentUser}
                        />
                    </React.Fragment>
                  )
              }
              
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    let data = state.firestore.data.users;
    let users = [];
    if (data) {
        for (let key in data) {
            users.push({
                _id: key,
                ...data[key]
            })
        }
    }
    return {
        users,
    }
}

const mapDispatchToProps = {
    setReadMessages,
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagePage)