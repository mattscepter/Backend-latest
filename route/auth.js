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
    facebookLogin,
    changePassword,
    forgotPassword,
    forgotPasswordChange
} = require('../controller/auth')

const {
    isSignedIn,
    isValidToken,
    isAdmin,
    isForgotPasswordVerified
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

router.post(
    '/change-password',
    [
        check('newPassword')
            .isLength({ min: 6 })
            .withMessage('New Password should be minimum of 6 characters')
    ],
    isSignedIn,
    isValidToken,
    changePassword
)

router.post('/forgot-password', forgotPassword)

router.post(
    '/forgot-password/verify/:uuid',
    [
        check('password')
            .isLength({ min: 6 })
            .withMessage('New Password should be minimum of 6 characters')
    ],
    isForgotPasswordVerified,
    forgotPasswordChange
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
