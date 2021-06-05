function generateChatId(sentUserId, currentUserId) {
    const keyArray = []
    keyArray.push(sentUserId)
    keyArray.push(currentUserId)
    keyArray.sort()
    return keyArray.join('_')
}


export const setReadMessages = (recipientId, messageId) => {
    return async (dispatch, getState, { getFirebase, getFirestore}) => {
        const firebase = getFirebase()
        const { user } = getState();
        const userId = user.currentUser._id;
        const chatId = generateChatId(
            recipientId,
            userId
        )
        const messageRef = firebase.ref('messages').child(chatId);
        const getMessages = await messageRef.get()
        const exists = getMessages.val() !== null;
        let updateMessage = {};
        if (exists) {
            let allMessages = getMessages.val()
            updateMessage = {...allMessages}

            for (let key in allMessages) {
                updateMessage[key].read = true;
            }
            return messageRef.update({
                ...updateMessage
            })

        }


    }
}

