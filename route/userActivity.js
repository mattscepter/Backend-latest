/**
 * @author krish
 */

const express = require('express')
const router = express.Router()
const {
    createActivity,
    getUserAvtivity,
    getOtherUserActivity,
    getAllUserActivities,
    deleteActivityById,
    deleteAllActivitiesByUserId
} = require('../controller/userActivity')
const {
    isSignedIn,
    isValidToken,
    isAdmin
} = require('../controller/middleware')

router.post(
    '/user-activity/create/:userId',
    isSignedIn,
    isValidToken,
    isAdmin,
    createActivity
)
router.get('/user-activity/get', isSignedIn, isValidToken, getUserAvtivity)
router.get(
    '/user-activity/get-user',
    isSignedIn,
    isValidToken,
    isAdmin,
    getOtherUserActivity
)
router.get(
    '/user-activity/get-all',
    isSignedIn,
    isValidToken,
    isAdmin,
    getAllUserActivities
)

router.delete(
    '/user-activity/delete/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteActivityById
)

router.delete(
    '/user-activity/delete-user/:userId',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteAllActivitiesByUserId
)

module.exports = router
