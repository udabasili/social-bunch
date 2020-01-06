const express = require("express")
const route = express.Router()
const userController = require("../controllers/user")
const messageController = require("../controllers/message")
const eventController = require("../controllers/event")
const groupController = require("../controllers/groups")
const authenticate = require("../middleware/confirmAuth")

route.get("/authenticate-user", authenticate.confirmAuthentication )
route.get("/user/:userId/send-friend-request/:addedUserId", userController.sendFriendRequest)
route.get("/user/:userId/accept-friend-request/:addedUserId", userController.acceptFriend)
route.get("/user/:userId/reject-friend-request/:addedUserId", userController.rejectFriend)

route.put("/user/:userId/edit", userController.editUser)
route.post("/user/:userId/create-event/", eventController.createEvent)
route.get("/user/:userId/event/:eventId/", eventController.getEvent)
route.get("/user/:userId/event/:eventId/delete", eventController.deleteEvent)
route.get("/user/:userId/event/:eventId/join", eventController.joinEvent)
route.get("/user/:userId/event/:eventId/leave", eventController.leaveEvent)

route.post("/user/:userId/create-group/", groupController.createGroup)
route.get("/user/:userId/group/:groupId/", groupController.getGroup)
route.get("/user/:userId/group/:groupId/delete", groupController.removeGroup)
route.get("/user/:userId/group/:groupId/join", groupController.joinGroup)
route.get("/user/:userId/group/:groupId/leave", groupController.leaveGroup)

route.post("/user/:userId/send-message/:receiverId", messageController.createMessage)
module.exports = route