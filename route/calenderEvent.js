/**
 * @author krish
 */

const express = require('express')
const router = express.Router()
const {
    addEvent,
    updateEvent,
    getEventById,
    getUserEvents,
    getAllEvents,
    deleteEventById,
    deleteUserEvents,
    deleteAllEvents,
    deleteAllUserEvents
} = require('../controller/calenderEvent')
const {
    isSignedIn,
    isValidToken,
    isAdmin
} = require('../controller/middleware')

router.post(
    '/calender-event/create',
    isSignedIn,
    isValidToken,
    isAdmin,
    addEvent
)
router.put(
    '/calender-event/update/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    updateEvent
)
router.get('/calender-event/get/:id', isSignedIn, isValidToken, getEventById)
router.get(
    '/calender-event/get/user/:userId',
    isSignedIn,
    isValidToken,
    getUserEvents
)
router.get(
    '/calender-event/get-all',
    isSignedIn,
    isValidToken,
    isAdmin,
    getAllEvents
)

router.delete(
    '/calender-event/delete/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteEventById
)
router.delete(
    '/calender-event/delete/user/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteUserEvents
)
router.delete(
    '/calender-event/delete-all/user/:userId',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteAllUserEvents
)
router.delete(
    '/calender-event/delete-all',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteAllEvents
)

module.exports = router
