const express = require("express")
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")
const errorHandler = require("./controllers/errorHandler")
const path = require("path");
const userRoutes = require("./routes/user")
const generalRoutes = require("./routes/general")
const chat = require("./chat/chat");
const messages = require("./chat/messages");
const videoChat = require("./video-call/video")
const mongoConnect = require("./utils/db");
const authRoute = require("./routes/auth");
const authenticated = require("./middleware/confirmAuth")
const PORT = process.env.PORT || 6000 ;

//socket.io config 
 const http = require("http");
const server = http.createServer(app);//we use this config to pass to socketio and run it
//instead of app
const socketIo = require("socket.io");
const io = socketIo(server)
//initialize middleware
app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

//if in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname,'client/build')))
}

//routes
app.use(authRoute);
app.use("/authenticate-user", authenticated.confirmAuthentication)
app.use(generalRoutes);
app.use(authenticated.protectedRoute);
app.use("/video-token", videoChat.getVideoToken)
app.use("/user/:userId/", authenticated.confirmUser,userRoutes);
app.use(errorHandler);

//app.use(errorHandler)
//Handling pages not found
app.use(function(req, res, next){
    let error = new Error("Not Found")
    error.status = 404;
    next(error)
})

//static file for Production stage


//start the connection of the server
io.on("connection", (client)=>{
    
    //set all the rooms once we reload
    client.on("onload",(username,callback) => {
        chat.setRooms()
        .then((response)=>{
            chat.setUserSocketId(username, client.id)
                .then(response=>callback(response))
        })
    })
    

    //create room
    client.on("create", (roomName, callback) =>{
        chat.createRoom(roomName)
        .then((response)=>callback(response))

    })

    //add the user to a room when he loads link
    client.on("join", ({username, groupId}, callback) =>{         
        chat.joinRoom(username, client.id, groupId)
           .then((response) =>{
            let room = response.socket[0].name
               client.join(room)
                io.to(room).emit("onlineUsersStatus", response)
               callback(response);                            
               
           })
       })

    
    //user leave group
    client.on("leave", ({username, roomId }, callback) =>{         
        chat.leaveRoom(username, roomId )
            .then((response) =>{
                console.log(response);
                
                let room = response.socket[0].name
               client.leave(room)
                io.to(room).emit("onlineUsersStatus", response)
            })
        })
    //send message to particular room
    client.on("messageToGroup", ({message,senderId, groupId}) =>{
        let date = new Date();
        chat.getUser(senderId, groupId)
            .then((response) =>{                                
                client.to(response.room).emit('newMessage', {
                    text: message,
                    createdAt: date.toISOString(),
                    groupName: response.room,
                    createdBy: response.username,
                })
            })   
        })

        //send private message
        client.on("messageUser", ({message,receiver,sender}, callback) =>{
        let date = new Date();
        chat.getUserSocketId(receiver)
            .then((response) =>{                 
                    io.to(response).emit('privateNewMessage', {
                    text: message,
                    createdAt: date.toISOString(),
                    createdBy: sender,
                    })     
            callback()
            }
        )   
    })

    client.on("voiceCall", ({receive, currentName, room}) =>{
        console.log(receive, currentName);
        
        chat.getUserSocketId(receive)
        .then((response) =>{                             
            io.to(response).emit('receive', {
            incomingCalling: true,
            room:room,
            caller: currentName,
            calling:receive
            })     
        })   
    })
// get all the members in the group status when the page is loaded
    client.on("getOnlineUsers", (roomId, callback)=>{
        chat.getAllUsersRoom(roomId)
            .then((result) => {                                
                callback(result)
            }).catch((err) => {
                callback(err)
        });
    })

    // get all the members in the group status when the page is loaded
    client.on("getOnlineFriends", (username, callback)=>{
        chat.getOnlineFriends(username)
            .then((result) => {                                
                callback(result)
            }).catch((err) => {
                callback(err)
        });
    })
    
    
    client.on("disconnect",  function(){
        chat.logout(client.id)
        .then((data)=>{
            })
        console.log(`${client.id} has left the chat`);
        
    })
})

app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

server.listen(PORT, (req, res)=>{
    console.log(`Serving is running on PORT ${PORT}`);
    mongoConnect.on('error', console.error.bind(console, 'MongoDB connection error:'));
    mongoConnect.once('open', function(data) {
    console.log("Mongoose database connected")
        
    })
    
})