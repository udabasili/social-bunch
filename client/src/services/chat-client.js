import sockerIOClient from 'socket.io-client'
const socket = sockerIOClient.connect(window.location.origin, {
    path: '/socket.io/'
})

class ChatClient {

    startConnection(){
        socket.emit('connection')
    }

    sendPrivateMessageSender(privateMessageListenerParams) {
        console.log(privateMessageListenerParams)
        socket.emit('private', privateMessageListenerParams)
    }

    privateMessageListener(privateMessageListenerFunction) {
        socket.on('private_chat', privateMessageListenerFunction)
    }

    UnregisterPrivateMessageListener(privateMessageListenerFunction) {
        socket.off('private_chat', privateMessageListenerFunction)
    }

    MessagesListener(MessagesListenerFunction) {
        socket.on('messages', MessagesListenerFunction)
    }

    UnregisterMessagesListener(MessagesListenerFunction) {
        socket.off('messages', MessagesListenerFunction)
    }


    setUserSocket(setUserSocketParams) {
        socket.emit('set-socket', setUserSocketParams)
    }

    changePostListener (changePostListenerFunction) {
         socket.on("posts", changePostListenerFunction);
    }

    UnregisterChangePostListener(changePostListenerFunction) {
        socket.off("posts", changePostListenerFunction);
    }

    usersListener(usersListenerFunction) {
        socket.on("users", usersListenerFunction);
    }

    UnregisterUsersListener(UsersListenerFunction) {
        socket.off("users", UsersListenerFunction);
    }

    eventsListener(eventsListenerFunction) {
        socket.on("events", eventsListenerFunction);
    }

    UnregisterEventsListener(eventsListenerFunction) {
        socket.off("events", eventsListenerFunction);
    }

    groupsListener(groupsListenerFunction) {
        socket.on("groups", groupsListenerFunction);
    }

    UnregisterGroupsListener(groupsListenerFunction) {
        socket.off("groups", groupsListenerFunction);
    }

    notificationsListener(notificationsListenerFunction) {
        socket.on("notifications", notificationsListenerFunction);
    }

    UnregisternotificationsListener(notificationsListenerFunction) {
        socket.off("notifications", notificationsListenerFunction);
    }

    disconnect(){
        socket.disconnect()
    }

    getSocket() {
        return socket
    }


}

export default ChatClient;