const express = require("express")
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")
const errorHandler = require("./controllers/errorHandler")
const path = require("path");
const userRoutes = require("./routes/user")
const generalRoutes = require("./routes/general")
const messageRoutes = require("./routes/messages")
const chat = require("./chat/chat");
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by')

//if in production
app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, 'client/build/index.html'))
})
app.use(express.static(path.join(__dirname,'client/build')))


//routes
app.use(authRoute);
app.use("/authenticate-user", authenticated.confirmAuthentication)
app.use(generalRoutes);
app.use(authenticated.protectedRoute);
app.use(messageRoutes);
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
        console.log(username, groupId);
                
        chat.joinRoom(username, client.id, groupId)
           .then((response) =>{
                let room = response.socket[0].name
               client.join(room)
                io.to(room).emit("updateRoomMemberStatus", response)
               callback(response);                            
               
           })
       })

    
    //user leave group
    client.on("leave", ({username, roomId }, callback) =>{    
        console.log({username, roomId })     
        chat.leaveRoom(username, roomId )
            .then((response) =>{                
                let room = response.socket[0].name
               client.leave(room)
                client.to(room).emit("updateRoomMemberStatus", response)
            })
        })
    //send message to particular room
    client.on("messageToGroup", ({message,senderId, groupId}) =>{
        console.log(message,senderId, groupId);
        
        let date = new Date();
        chat.getUser(senderId, groupId)
            .then((response) =>{      
                console.log(response);
                                          
                io.to(response.room).emit('groupMessage', {
                    text: message,
                    createdAt: date.toISOString(),
                    groupName: response.room,
                    createdBy: response.username,
                })
            })   
        })

        //send private message  F_sp5QzOF7WoNpDNAAAD Dreamcatcher008
        client.on("messageUser", ({message,receiver,sender,location}, callback) =>{
        let date = new Date();
        chat.getUserSocketId(receiver)        
            .then((response) =>{                 
                    client.to(response).emit('privateMessage', {
                    text: message,
                    createdAt: date.toISOString(),
                    createdBy: sender,
                    sentTo: receiver,
                    location
                    })     
            callback()
            }
        )   
    })

    client.on("voiceCall", ({ calling, caller, room}) =>{     
        console.log({ calling, caller, room})   
        chat.getUserSocketId(calling)
        .then((response) =>{                             
            client.to(response).emit('receive', {
            incomingCalling: true,
            room:room,
            caller: caller,
            calling:calling
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



server.listen(PORT, (req, res)=>{
    console.log(`Serving is running on PORT ${PORT}`);
    mongoConnect.on('error', console.error.bind(console, 'MongoDB connection error:'));
    mongoConnect.once('open', function(data) {
    console.log("Mongoose database connected")
        
    })
    
})