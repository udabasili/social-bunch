const express = require("express")
const route = express.Router({mergeParams: true})// get id from router
const usersController = require("../controllers/users")
const eventController = require("../controllers/event")
const groupController = require("../controllers/groups")

route.get("/events", eventController.getEvents)
route.get("/groups", groupController.getGroups)
route.get("/users", usersController.getAllUsers)

module.exports = route