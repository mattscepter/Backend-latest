const userModel = require('../model/user.js')
const forgotPasswordModel = require('../model/forgotPassword')
const expressJwt = require('express-jwt')
const moment = require('moment')
const { statusCode: SC } = require('../utils/statusCode')

const isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['HS256', 'RS256'],
    userProperty: 'auth'
})

const isValidToken = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res
            .status(SC.UNAUTHORIZED)
            .json({ error: 'Authentication Failed!' })
    }
    next()
}

const isAuthenticated = (req, res, next) => {
    const checker = req.profile && req.auth && req.profile._id == req.auth._id
    if (!checker) {
        return res.status(SC.FORBIDDEN).json({
            error: 'ACCESS DENIED!'
        })
    }
    next()
}

//role -> 3
const isEmployee = async (req, res, next) => {
    const authId = req.auth._id

    if (authId) {
        await userModel.findById(authId).exec((err, user) => {
            if (err || !user) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'No user was found in DB!'
                })
            }
            if (user.role === 3) {
                next()
            } else {
                res.status(SC.UNAUTHORIZED).json({
                    error: 'Not an Employee!'
                })
            }
        })
    }
}

//role --> 4
const isInstructor = async (req, res, next) => {
    const authId = req.auth._id

    if (authId) {
        await userModel.findById(authId).exec((err, user) => {
            if (err || !user) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'No user was found in DB!'
                })
            }
            if (user.role === 4) {
                next()
            } else {
                res.status(SC.UNAUTHORIZED).json({
                    error: 'Not a Instructor!'
                })
            }
        })
    }
}

//role --> 2
const isAdmin = async (req, res, next) => {
    const authId = req.auth._id

    if (authId) {
        await userModel.findById(authId).exec((err, user) => {
            if (err || !user) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'No user was found in DB!'
                })
            }
            if (user.role === 2 || user.role === 3 || user.role === 4) {
                next()
            } else {
                res.status(SC.UNAUTHORIZED).json({
                    error: 'Not an admin!'
                })
            }
        })
    }
}

//--> 2 or 4
const isAdminOrInstructor = async (req, res, next) => {
    const authId = req.auth._id

    if (authId) {
        await userModel.findById(authId).exec((err, user) => {
            if (err || !user) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'No user was found in DB!'
                })
            }
            if (user.role === 2 || user.role === 4) {
                next()
            } else {
                res.status(SC.UNAUTHORIZED).json({
                    error: 'Not an admin or an Instructor!'
                })
            }
        })
    }
}

const hasCourseorAdmin = async (req, res, next) => {
    const authId = req.auth._id
    const courseId = req.params.courseId
    if (authId) {
        await userModel.findById(authId).exec((err, user) => {
            if (err || !user) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'No user was found in DB!'
                })
            }
            if (user.role === 2) {
                next()
            } else if (user.courses.includes(courseId)) {
                next()
            } else {
                res.status(SC.UNAUTHORIZED).json({
                    error: 'Course not bought'
                })
            }
        })
    }
}

const isForgotPasswordVerified = async (req, res, next) => {
    const forgotPasswordUUID = req.params.uuid

    await forgotPasswordModel.find({ forgotPasswordUUID }).exec((err, data) => {
        if (err) {
            logger(err, 'ERROR')
        }
        if (data && moment().diff(data.validTill, 'minute') <= 0) {
            next()
        } else {
            res.status(SC.BAD_REQUEST).json({
                error: 'Forgot Password UUID is not valid!'
            })
        }
    })
}

module.exports = {
    isSignedIn,
    isValidToken,
    isAuthenticated,
    isEmployee,
    isInstructor,
    isAdmin,
    isAdminOrInstructor,
    hasCourseorAdmin,
    isForgotPasswordVerified
}
