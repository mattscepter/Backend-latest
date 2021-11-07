/**
 * @author krish
 */

const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const {
    signup,
    signin,
    update,
    updateRole,
    signout,
    googleLogin,
    facebookLogin
} = require('../controller/auth')

const {
    isSignedIn,
    isValidToken,
    isAdmin
} = require('../controller/middleware')

router.post(
    '/signup',
    [
        check('email').isEmail().withMessage('Please provide a valid E-Mail!'),
        check('password')
            .isLength({ min: 6 })
            .withMessage('Password length should be minimum of 8 characters')
    ],
    signup
)

router.post(
    '/signin',
    [
        check('email').isEmail().withMessage('Please provide a valid E-Mail!'),
        check('password')
            .isLength({ min: 1 })
            .withMessage('Password field is required')
    ],
    signin
)

router.post('/googlelogin', googleLogin)

router.post('/facebooklogin', facebookLogin)

router.put(
    '/user/update',
    [check('id').isUUID().withMessage('Please Provide id')],
    isSignedIn,
    isValidToken,
    update
)
router.put(
    '/user/updateRole/:userId',
    isSignedIn,
    isValidToken,
    isAdmin,
    updateRole
)

router.get('/signout', signout)

module.exports = router
