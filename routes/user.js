const express = require("express")
const route = express.Router({mergeParams: true})
const userController = require("../controllers/user")
const messageController = require("../controllers/message")
const eventController = require("../controllers/event")
const groupController = require("../controllers/groups")

route.post("/profile/edit", userController.editUser)
route.get("/send-friend-request/:addedUserId", userController.sendFriendRequest)
route.get("/accept-friend-request/:addedUserId", userController.acceptFriend)
route.get("/reject-friend-request/:addedUserId", userController.rejectFriend)

route.post("/create-event/", eventController.createEvent)
route.get("/event/:eventId/", eventController.getEvent)
route.get("/event/:eventId/delete", eventController.deleteEvent)
route.get("/event/:eventId/join", eventController.joinEvent)
route.get("/event/:eventId/leave", eventController.leaveEvent)

route.post("/create-group/", groupController.createGroup)
route.get("/group/:groupId/", groupController.getGroup)
route.get("/group/:groupId/delete", groupController.removeGroup)
route.get("/group/:groupId/join", groupController.joinGroup)
route.get("/group/:groupId/leave", groupController.leaveGroup)

route.post("/send-message/:receiverId", messageController.createMessage)
module.exports = route