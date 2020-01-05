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
const mongoConnect = require("./utils/db");
const authRoute = require("./routes/auth");
const authenticated = require("./middleware/confirmAuth")
const spotify = require("./spotify/spotify")
const PORT = process.env.PORT || 6000 ;
//socket.io config 
 // we use this 

 const http = require("http");
const server = http.createServer(app);//we use this config to pass to socketio and run it
//instead of app
const socketIo = require("socket.io");
const io = socketIo(server)


//intialize middleware
app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
//routes
app.use(authRoute)
app.use(spotify)
app.use(authenticated.protectedRoute)
app.use(userRoutes)
app.use(generalRoutes)
app.use(errorHandler)

//app.use(errorHandler)
//Handling pages not found
app.use(function(req, res, next){
    let error = new Error("Not Found")
    error.status = 404;
    next(error)
})

//static file for Production stage

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname,'client/build')))
    app.get("*", (req, res)=>{
        res.sendFile(path.join(__dirname, 'client/build/index.html'))
    })
}

//start the connection of the server
io.on("connection", (client)=>{
    
    //set all the rooms once we reload
    client.on("onload",(callback) => {
        chat.setRooms()
        .then((response)=>callback(response))
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

    
    //get socketid when you access  

    //set the current users chatooom status based on the group he is
    // client.on("setRoomsByUser",(username, callback) => {         
    //     chat.setRooms(username, client.id)
    //     .then((response) =>{
    //         if(response.error){
    //             return callback(response.error)
    //         }
    //         let username = response.username
    //         let rooms = response.rooms                
    //         // send message to rooms the current user is part of
    //         for (let room of rooms){                
    //             client.join(room)
    //             io.to(room).emit('newUser', messages.generateMessage(`${username} has joined!`))
    //         }
            
    //     })
    // })
    

     

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
                    message: message,
                    dateTime: date.toISOString(),
                    groupName: response.room,
                    sender: response.username,
                    type:'receive'
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
    
    client.on("disconnect",  function(){
        chat.logout(client.id)
        .then((data)=>{
            console.log(data);
            
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