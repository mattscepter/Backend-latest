const userModel = require('../model/user.js')
const expressJwt = require('express-jwt')
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

const isEmployee = (req, res, next) => {
    const authId = req.auth._id

    if (authId) {
        userModel.findById(authId).exec((err, user) => {
            if (err || !user) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'No user was found in DB!'
                })
            }
            if (user.role === 3) {
                next()
            } else {
                return res.status(SC.UNAUTHORIZED).json({
                    error: 'Not an Employee!'
                })
            }
        })
    }
}

const isInstructor = (req, res, next) => {
    const authId = req.auth._id

    if (authId) {
        userModel.findById(authId).exec((err, user) => {
            if (err || !user) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'No user was found in DB!'
                })
            }
            if (user.role === 4) {
                next()
            } else {
                return res.status(SC.UNAUTHORIZED).json({
                    error: 'Not a Instructor!'
                })
            }
        })
    }
}

const isAdmin = (req, res, next) => {
    const authId = req.auth._id

    if (authId) {
        userModel.findById(authId).exec((err, user) => {
            if (err || !user) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'No user was found in DB!'
                })
            }
            if (user.role === 2 || user.role === 3 || user.role === 4) {
                next()
            } else {
                return res.status(SC.UNAUTHORIZED).json({
                    error: 'Not an admin!'
                })
            }
        })
    }
}

const isAdminOrInstructor = (req, res, next) => {
    const authId = req.auth._id

    if (authId) {
        userModel.findById(authId).exec((err, user) => {
            if (err || !user) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'No user was found in DB!'
                })
            }
            if (user.role === 2 || user.role === 3) {
                next()
            } else {
                return res.status(SC.UNAUTHORIZED).json({
                    error: 'Not an admin or an Instructor!'
                })
            }
        })
    }
}

module.exports = {
    isSignedIn,
    isValidToken,
    isAuthenticated,
    isEmployee,
    isInstructor,
    isAdmin,
    isAdminOrInstructor
}
