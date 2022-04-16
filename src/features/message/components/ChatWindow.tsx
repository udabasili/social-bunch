import {useState, useEffect, useRef} from 'react'
import { BsPeople } from 'react-icons/bs';
import { AiOutlineSend } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { MessageAttributes, MessageOTP } from '../type';
import { useAuth } from '@/lib/auth';
import { generateChatId } from '../api/setReadMessages';
import { UserAttributes } from '@/features/user/types';
import { child, push, ref, update } from 'firebase/database';
import { database } from '@/lib/fuego';
import ChatMessages from './ChatMessages';

interface ChatWindowProps {
    pushMessage: (message: MessageOTP) => void
    messages: Array<MessageAttributes>
    user: UserAttributes
    setReadMessages: (recipientId: string) => Promise<void>
}

const ChatWindow = ({
        user,
        pushMessage,
        messages,
        setReadMessages
    }: ChatWindowProps) => {
    
    const chatMessageArea = useRef<HTMLDivElement>(null)
    const currentSender = useRef<string | null>()
    const {currentUser} = useAuth()


    useEffect(() => { 
        if (chatMessageArea.current){
            chatMessageArea.current.scrollTop = chatMessageArea.current?.scrollHeight;
        }
        //use this to ensure that messages are only marked as read when the use opens this component for the first time
        if (!currentSender.current) {
            setReadMessages(user.uid)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages])

    const [text, setText] = useState('');

    const showProfile = () => {
        const userProfileComponent = document.querySelector<HTMLDivElement>('#user-profile')
        userProfileComponent?.classList.add('show-profile-component')
    }

    async function sendMessage(){
        const chatId = generateChatId(
            user.uid,
            currentUser.uid
        )
        const newMessageKey = push(child(ref(database), `messages`)).key;

        if(text.length === 0 ){
            toast.error('Text box cannot be empty')
            return;
        }
        
        const data = {
            from: '',
            message: {},
            to: ''
        }
        data.from = currentUser.uid;
        const message = {
            text,
            createdBy: currentUser.uid,
            chatId,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        pushMessage(message)
        data.message = message;
        data.to = user.uid;
        setText('')
        currentSender.current = currentUser.uid
        const updates: any = {};
        updates['/messages/' + chatId + "/" + newMessageKey] = {
            ...message,
            status: 'delivered',
            read: false
        };

        await update(ref(database), updates);

        //this is to ensure that the setRead in useEffect isnt activated immediately after currentUser has sent message
        //that way currentSender.current = null only activates for new messages coming from the other user not this one
        setTimeout(() => {
            currentSender.current = null
        }, 3000);

    }

    return (
        <div className="chat-window">
            <div className="chat-window__header">
                <div className="user">
                    <img 
                        src = {
                            user.image || "https://img.icons8.com/ios/50/000000/user-male-circle.png"
                        }
                        alt={user.username}
                        className="avatar"
                    />
                    <span  className="username">
                        {user.username}
                    </span>
                </div>
                <div className="icons">
                    <span
                        className="icon mobile-only"
                        title="View profile"
                        onClick={showProfile}
                    >
                        <BsPeople/>
                    </span>
                </div>
            </div>
            <div className="chat-window__body" ref={chatMessageArea}>
                {
                    messages.map((message, index) => (
                        <ChatMessages
                            message={message}
                            key={message.id || index}
                            recipient={user}
                        />
                    ))
                }
            </div>
            <div className="chat-window__chat-box">
                <textarea
                    className="input"
                    placeholder="Start typing Message...."
                    onChange={ e => setText(e.target.value)}
                    value={text}
                    required
                />
                <span className="send">
                    <AiOutlineSend
                        title='Send'
                        onClick={sendMessage}
                    />
                </span>
            </div>
        </div>
    )
}


export default ChatWindow
