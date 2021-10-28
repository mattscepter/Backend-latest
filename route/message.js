/**
 * @author krish
 */

const express = require('express')
const router = express.Router()
const {
    createMessage,
    getUserMessage,
    getAllMessage,
    deleteMessageById,
    deleteUserFromMessage,
    deleteUserFromAllMessages,
    deleteAllMessages
} = require('../controller/message')
const {
    isSignedIn,
    isValidToken,
    isAdmin
} = require('../controller/middleware')

router.post('/message/create', isSignedIn, isValidToken, isAdmin, createMessage)
router.get('/message/get/:userId', isSignedIn, isValidToken, getUserMessage)
router.get('/message/get-all', isSignedIn, isValidToken, isAdmin, getAllMessage)
router.delete(
    '/message/delete/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteMessageById
)
router.delete(
    '/message/delete/user/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteUserFromMessage
)
router.delete(
    '/message/delete-all/user/:userId',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteUserFromAllMessages
)
router.delete(
    '/message/delete-all',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteAllMessages
)

module.exports = router
