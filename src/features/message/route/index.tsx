import React, { useEffect, useState } from "react";
import { UserAttributes } from "@/features/user/types";
import { useAuth } from "@/lib/auth";
import { database } from "@/lib/fuego";
import { limitToLast, onValue, orderByChild, query, ref } from "firebase/database";
import { MessageAttributes, MessageOTP } from "../type";
import { UseGetUsers } from "@/features/users/api/getAllUsers";
import { generateChatId, useSetReadMessages } from "../api/setReadMessages";
import ChatWindow from "../components/ChatWindow";
import ChatUserProfile from "../components/ChatUserProfile";
import ChatUserList from "../components/ChatUserList";
import { MainLayout } from "@/components/Layout/MainLayout";

export const MessagePage = () => {

    const [selectedUser, setSelectedUser] = useState<UserAttributes>();
    const [messages, setMessages] = useState<Array<MessageAttributes>>([]);
    const { currentUser } = useAuth();
    const { users } = UseGetUsers()
    const { setReadMessages } = useSetReadMessages()


    const pushMessage = (message: MessageOTP) => {
        setMessages((prevState) => ({
            ...prevState,
            messages: [
            ...prevState,
            {
                ...message,
                status: "sending",
            },
            ],
        }))
    };

    const selectUserHandler = (user: UserAttributes) => {
        setSelectedUser(user)
    };

    useEffect(() => {
        if (selectedUser) {
        const chatId = generateChatId(currentUser.uid, selectedUser?.uid);
        const messageRef = query(ref(database, "messages/" + chatId), orderByChild("createdAt"), limitToLast(25))
        onValue(messageRef, (snapshot) => {
            const exists = snapshot.val() !== null;
            let messages: Array<MessageAttributes> = [];
            let messagesData = snapshot.val();
            if (exists) {
            for (let k in messagesData) {
                let messageObject = messagesData[k];
                messages.push({
                _id: k,
                ...messageObject,
                });
            }
            setMessages([...messages]);
            }

        })
        
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedUser]);


    return (
        <MainLayout>
            <div className="messages-page">
          <ChatUserList
                users={users || []}
                selectUserHandler={selectUserHandler}
                setReadMessages={setReadMessages}         />
          {selectedUser && (
            <React.Fragment>
              <ChatWindow
                user={selectedUser}
                pushMessage={pushMessage}
                messages={messages}
                setReadMessages={setReadMessages}
              />
              <ChatUserProfile user={selectedUser} />
            </React.Fragment>
          )}
        </div>
        </MainLayout>
        
      );
};


export default MessagePage
