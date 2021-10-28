const mongoose = require('mongoose')

const { loggerUtil: logger } = require('../utils/logger')

const connection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        })
        logger('DB Connected Successfully', 'SERVER')
    } catch (err) {
        logger('DB Connection Failed', 'SERVER')
        logger(err, 'ERROR')
    }
}

module.exports = connection
