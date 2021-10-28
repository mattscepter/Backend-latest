/**
 * @author krish
 */

const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const {
    saveSubscription,
    getSubscriptionById,
    getAllSubscriptions,
    updateSubscriptionById,
    deleteSubscriptionById
} = require('../controller/subscription')
const {
    isSignedIn,
    isValidToken,
    isAdmin
} = require('../controller/middleware')

router.post(
    '/subscription/save',
    check('email').isEmail().withMessage('Please Provide a valid E-Mail !'),
    saveSubscription
)

router.get(
    '/subscription/get/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    getSubscriptionById
)
router.get(
    '/subscription/get-all',
    isSignedIn,
    isValidToken,
    isAdmin,
    getAllSubscriptions
)

router.put(
    '/subscription/update/:id',
    check('email').isEmail().withMessage('Please Provide a valid E-Mail !'),
    isSignedIn,
    isValidToken,
    isAdmin,
    updateSubscriptionById
)
router.delete(
    '/subscription/delete/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteSubscriptionById
)

module.exports = router
