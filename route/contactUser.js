/**
 * @author krish
 */

const express = require('express')
const router = express.Router()
const {
    saveUserContact,
    getUserContact,
    getAllUserContacts,
    deleteUserContactById
} = require('../controller/contactUser')
const {
    isSignedIn,
    isValidToken,
    isAdmin
} = require('../controller/middleware')

router.post('/contact-user/save', saveUserContact)
router.get(
    '/contact-user/get/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    getUserContact
)
router.get(
    '/contact-user/get-all',
    isSignedIn,
    isValidToken,
    isAdmin,
    getAllUserContacts
)
router.delete(
    '/contact-user/delete/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteUserContactById
)

module.exports = router
