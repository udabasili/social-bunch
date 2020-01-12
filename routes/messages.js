const express = require("express")
const route = express.Router();
const messageController = require("../controllers/message");

route.post("/user/:userId/send-message/:receiverId", messageController.createMessage)
route.get("/user/:userId/messages/:recipientId", messageController.getMessagesBetweenUsers)
module.exports = route;