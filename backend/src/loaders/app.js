const express = require('express')
const cookieParser = require('cookie-parser');
const app = express()
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })
const cloudinaryConfig = require('./cloudinary');

app.disable('x-powered-by')
app.use(cloudinaryConfig.cloudinaryConfig);
app.use(cookieParser())
app.use(csrfProtection)
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

require('./routes')(app);




module.exports = app;