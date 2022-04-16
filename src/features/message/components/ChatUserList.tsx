import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { UserAttributes } from '@/features/user/types'
import { useAuth } from '@/lib/auth'
import { OnlineProps } from '../type'
import { off, onValue, ref } from 'firebase/database'
import { database } from '@/lib/fuego'


interface Props {
    users: Array<UserAttributes>
    setReadMessages: (recipientId: string) => Promise<void>
    selectUserHandler:(user: UserAttributes) => void

}
const ChatUserList = ({
    users,
    selectUserHandler,
    setReadMessages,
    }: Props) => {

    const { currentUser } = useAuth()
    const [unReadMessages, setUnReadMessages] = useState<Array<{
        unReadMessagesCount: number,
        otherUserId: string
    }>>()
    const [onlineUsers, setOnlineUsers] = useState<Array<string>>([])

    useEffect(() => {
            const messageRef = ref(database, "messages" )
            const presenceRef = ref(database, "status" )
            let unReadMessages = []
            let currentUserMessageIds = [];
            onValue(messageRef, (snapshot) => {
                const exists = snapshot.val() !== null;
                let messages = snapshot.val();
                if (exists) {
                    const objKeys = Object.keys(messages)
                    currentUserMessageIds = objKeys.filter(item => item.includes(currentUser.uid))
                    let eachUnreadMessage = []
                    unReadMessages = currentUserMessageIds.map((id) => {
                        let message = messages[id]
                        for (let key in message) {
                            if (message[key].createdBy !== currentUser.uid && !message[key].read) {
                                    eachUnreadMessage.push(message[key])
                            }
                        } 
                        let unReadMessagesCount = eachUnreadMessage.length
                        const otherUserId = id.split('_').filter(item => !item.includes(currentUser.uid))[0]
                        return {
                            unReadMessagesCount,
                            otherUserId

                        }
                    })
                    setUnReadMessages([
                        ...unReadMessages
                    ])
                
                }
            })
            
            onValue(presenceRef, (snapshot) => {
                let onlineUsers: Array<string> = [];
                snapshot.forEach((childSnapshot) => {
                    const childKey = childSnapshot.key;
                    const childData = childSnapshot.val() as OnlineProps;
                    if (childData && childKey){
                        if(childData.state === "online"){
                            onlineUsers.push(childKey)
                        }
                    }
                    
                    // ...
                  });
                  setOnlineUsers([
                        ...onlineUsers
                    ])
                
            
            })
        return () => {
            off(messageRef)
            off(presenceRef)
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    
    const unReadMessagesPerUser = (userId: string) => {
        let result = unReadMessages?.filter((message) => (
            message.otherUserId === userId
        ))
        if(result?.length === 1) {
            return result[0].unReadMessagesCount
        } else {
            return 0
        }
    }

    const checkOnlineUser = (userId: string) => {
        return onlineUsers?.includes(userId)
    }

    const onClickEvent = (user: UserAttributes) => {
        setReadMessages(user.uid);
        selectUserHandler(user)
    }

    return (
        <div className="user-list">
            {
                users.filter((user) => currentUser.uid !== user.uid).map((user) => (
                    <div className="avatar-icon" 
                        key={user.uid}
                        onClick={() => {
                            onClickEvent(user)
                        }}
                    >
                        <img 
                            src = {
                                user.image || "https://img.icons8.com/ios/50/000000/user-male-circle.png"
                            }
                            alt={user.username}/>
                        <span className={`
                            online-status 
                            ${ checkOnlineUser(user.uid) ? "online": "offline"}
                        `}/>
                        {
                            unReadMessagesPerUser(user.uid) > 0 && (
                                <span className={`messages `}>
                                    { unReadMessagesPerUser(user.uid) }
                                </span>
                            )
                        }
                        
                    </div>
                ))
            }
        </div>
    )
}

ChatUserList.propTypes = {
    users: PropTypes.array
}



export default ChatUserList

