import  React from 'react';

export const ChatMessenger = ({message}) =>  {    
        let timeSplit =  message.dateTime.split("T")[1].split(":");
        let date = message.dateTime.split("T")[0].split("-")
    return (
        <li class="clearfix">
            <div class= {`message-data ${  message.type === "send" ? "sender-data"
                : message.type === "receive" ? "receive-data" : ""  }`}>
                <span class="message-data-name" >
                    {message.currentUser || message.sender}
                </span> 
                <span class="message-data-time" >
                    {`${date[1]}-${date[2]}`}
                </span> &nbsp; &nbsp;
                <span class="message-data-time" >
                        {`${timeSplit[0]}:${timeSplit[1]}`}
                    </span> &nbsp; &nbsp;
            </div>
                <div class= {`message ${  message.type === "send" ? "send-message"
                : message.type === "receive" ? "receive-message" : ""  }`}>
                    {message.message}
            </div>
        </li>
    )
}
            
