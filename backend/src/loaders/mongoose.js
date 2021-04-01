const mongoose = require('mongoose');
const { MONGOOSE_URI , MONGOOSE_URI_PASS, MONGOOSE_URI_USERNAME} = require('../config');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}

if( process.env.NODE_ENV === 'test'){
    mongoose.connect(`mongodb://localhost/test`, {
        ...options
    })
}else{
    mongoose.set('debug', true)
    mongoose.connect(MONGOOSE_URI, {
        ...options,
        auth: {
            user: MONGOOSE_URI_USERNAME,
            password: MONGOOSE_URI_PASS
        }
    })
}


const db = mongoose.connection;

module.exports = db