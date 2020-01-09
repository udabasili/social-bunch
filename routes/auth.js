const express = require("express")
const route = express.Router({mergeParams: true})
const userController = require("../controllers/user")
let multer = require('multer');
var upload = multer({ 
    limits:{
        fileSize:10000000
        }
    })
var cpUpload = upload.fields([{ name: 'file', maxCount: 1 }, { name: 'data', maxCount: 5 }])


route.post("/auth/register", cpUpload,  userController.signUp)
route.post("/auth/login", userController.signIn)

module.exports = route