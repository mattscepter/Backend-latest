/**
 * @author krish
 */

const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')
const mongo = require('./config/mongo')

dotenv.config()
const app = express()

//logger
const { loggerUtil: logger } = require('./utils/logger')

//mongo connection func call
mongo()

//routes
const auth = require('./route/auth')
const user = require('./route/user')
const empOfMonth = require('./route/empOfMonth')
const testimonial = require('./route/testimonial')
const contact = require('./route/contact')
const subscription = require('./route/subscription')
const docs = require('./route/docs')
const contactUser = require('./route/contactUser')
const client = require('./route/client')
const team = require('./route/team')
const userActivity = require('./route/userActivity')
const calenderEvent = require('./route/calenderEvent')
const message = require('./route/message')

app.use(express.static('public'))
app.use(express.json())
app.use(helmet())
app.use(cors())

//routes goes here
app.use('/api', auth)
app.use('/api', user)
app.use('/api', empOfMonth)
app.use('/api', testimonial)
app.use('/api', contact)
app.use('/api', subscription)
app.use('/api', docs)
app.use('/api', contactUser)
app.use('/api', client)
app.use('/api', team)
app.use('/api', userActivity)
app.use('/api', calenderEvent)
app.use('/api', message)

const PORT = 8000

app.listen(PORT, () => {
    logger(`Listening on port ${PORT}`, 'SERVER')
})
