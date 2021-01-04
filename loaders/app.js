const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const cloudinaryConfig = require('./cloudinary');
const path = require('path');


/**SECURITY MIDDLEWARE */
    app.use(cors())
    app.disable('x-powered-by')



/**FUNCTIONALITY MIDDLEWARE */
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cloudinaryConfig.cloudinaryConfig);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname));
    app.use(express.static(path.join(__dirname,'../client/build')))
}

/**ROUTE */

require('./routes')(app);
require('./db')()

/**STATIC FILES */  
process.on('unhandledRejection', error => {
    // Won't execute
    console.log('unhandledRejection', error);
});

    
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname));
    app.get('/*', (req, res)=>{
        res.sendFile(path.join(__dirname, '../client/build/index.html'))
    })
}

module.exports = app;
