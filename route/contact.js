/**
 * @author krish
 */

const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const { updateContact, getContact } = require('../controller/contact')
const {
    isSignedIn,
    isValidToken,
    isAdmin
} = require('../controller/middleware')

router.put(
    '/contact/update',
    check('email').isEmail().withMessage('Please Provide a valid E-Mail !'),
    isSignedIn,
    isValidToken,
    isAdmin,
    updateContact
)
router.get('/contact/get', getContact)

module.exports = router
