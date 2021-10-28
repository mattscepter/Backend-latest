/**
 * @author krish
 */

const userModel = require('../model/user.js')
const jwt = require('jsonwebtoken')
const { validationResult: validate } = require('express-validator')
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))
const { OAuth2Client: OAuth } = require('google-auth-library')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const signup = async (req, res) => {
    const errors = validate(req)
    if (!errors.isEmpty()) {
        return res.status(SC.WRONG_ENTITY).json({
            error: errors.array()[0].msg
        })
    }
    const { email } = req.body
    try {
        await userModel.findOne({ email }, (err, user) => {
            if (err || user) {
                return res.status(SC.WRONG_ENTITY).json({
                    error: 'E-Mail already has been registered!',
                    suggestion: 'Try using some other E-mail.'
                })
            } else {
                const user = new userModel(req.body)
                user.save((err, user) => {
                    if (err) {
                        return res.status(SC.BAD_REQUEST).json({
                            error: 'Failed to add user in DB!'
                        })
                    }
                    res.status(SC.OK).json({
                        message: 'User Signed Up, Successfully!',
                        data: {
                            id: user._id,
                            email: user.email,
                            password: user.encrypted_password
                        }
                    })
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger(`User Signed Up Sucessfully using Email - ${email}`)
    }
}

const update = async (req, res) => {
    const id = req.auth._id
    let result = req.body
    try {
        await userModel.findOne({ _id: id }).exec((err, data) => {
            if (err || !data) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'User Not Found!'
                })
            }

            result.employeeDuration &&
            result.employeeDuration.from === undefined
                ? (result.employeeDuration.from = data.employeeDuration.from)
                : null
            result.employeeDuration && result.employeeDuration.to === undefined
                ? (result.employeeDuration.to = data.employeeDuration.to)
                : null

            userModel
                .updateOne(
                    { _id: id },
                    {
                        $set: result
                    }
                )
                .then(() => {
                    res.status(SC.OK).json({
                        message: 'User Updated Successfully!'
                    })
                })
                .catch((err) => {
                    res.status(SC.INTERNAL_SERVER_ERROR).json({
                        error: 'User Updation Failed!'
                    })
                    logger(err, 'ERROR')
                })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('User Update Function is Executed')
    }
}

const signin = async (req, res) => {
    const errors = validate(req)
    if (!errors.isEmpty()) {
        return res.status(SC.WRONG_ENTITY).json({
            error: errors.array()[0].msg
        })
    }

    const { email, password } = req.body
    try {
        await userModel.findOne({ email }, (err, user) => {
            if (err || !user) {
                return res.status(SC.NOT_FOUND).json({
                    error: "E-Mail doesn't exist in DB!"
                })
            }
            if (!user.authenticate(password)) {
                return res.status(SC.UNAUTHORIZED).json({
                    error: 'Oops!, E-mail and Password does not match!'
                })
            }

            const expiryTime = new Date()
            expiryTime.setMonth(expiryTime.getMonth() + 6)
            const exp = parseInt(expiryTime.getTime() / 1000)
            const token = jwt.sign(
                { _id: user._id, exp: exp },
                process.env.SECRET
            )

            res.cookie('Token', token, { expire: new Date() + 9999 })

            user.salt = undefined
            user.__v = undefined
            return res.status(SC.OK).json({
                message: 'User Logged in Successfully!',
                token,
                user
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger(`User Signed in - ${email}`)
    }
}

const signout = (req, res) => {
    res.clearCookie('Token')

    res.status(SC.OK).json({
        message: 'User Signed Out Sucessfully!'
    })
}

const googleLogin = (req, res) => {
    try {
        const { idToken } = req.body
        const client = new OAuth(process.env.GOOGLE_TOKEN)
        client
            .verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_TOKEN
            })
            .then((response) => {
                const { email_verified, email, given_name, family_name } =
                    response.payload
                if (email_verified) {
                    userModel.findOne({ email }).exec((err, user) => {
                        if (err) {
                            return res.status(SC.BAD_REQUEST).json({
                                error: 'Login Failed!'
                            })
                        } else if (user) {
                            const expiryTime = new Date()
                            expiryTime.setMonth(expiryTime.getMonth() + 6)
                            const exp = parseInt(expiryTime.getTime() / 1000)

                            const token = jwt.sign(
                                { _id: user._id, exp },
                                process.env.SECRET
                            )

                            res.cookie('Token', token, {
                                expire: new Date() + 9999
                            })

                            user.salt = undefined
                            user.__v = undefined
                            return res.status(SC.OK).json({
                                message:
                                    'User Logged in Successfully from Google!',
                                token,
                                user
                            })
                        } else {
                            const encrypted_password = idToken + email
                            const userNew = new userModel({
                                email,
                                name: given_name,
                                lastname: family_name,
                                encrypted_password
                            })
                            userNew.save((err, data) => {
                                if (err) {
                                    return res.status(SC.BAD_REQUEST).json({
                                        error: 'Failed to add user in DB!'
                                    })
                                } else {
                                    const expiryTime = new Date()
                                    expiryTime.setMonth(
                                        expiryTime.getMonth() + 6
                                    )
                                    const exp = parseInt(
                                        expiryTime.getTime() / 1000
                                    )

                                    const token = jwt.sign(
                                        { _id: data._id, exp },
                                        process.env.SECRET
                                    )

                                    res.cookie('Token', token, {
                                        expire: new Date() + 9999
                                    })

                                    data.salt = undefined
                                    data.__v = undefined
                                    return res.status(SC.OK).json({
                                        message:
                                            'User Logged in Successfully from Google!',
                                        token,
                                        user
                                    })
                                }
                            })
                        }
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('User Logged in from Google!')
    }
}

const facebookLogin = async (req, res) => {
    try {
        const { userId, access_token } = req.body
        const urlGraphFacebook = `${process.env.FACEBOOK_TOKEN}${access_token}`
        const response = await fetch(urlGraphFacebook, {
            method: 'GET'
        })
        const { email, first_name, last_name, id } = await response.json()
        if (id === userId) {
            userModel.findOne({ email }).exec((err, user) => {
                if (err) {
                    return res.status(SC.BAD_REQUEST).json({
                        error: 'Login Failed!'
                    })
                } else if (user) {
                    const expiryTime = new Date()
                    expiryTime.setMonth(expiryTime.getMonth() + 6)
                    const exp = parseInt(expiryTime.getTime() / 1000)

                    const token = jwt.sign(
                        { _id: user._id, exp },
                        process.env.SECRET
                    )

                    res.cookie('Token', token, { expire: new Date() + 9999 })

                    user.salt = undefined
                    user.__v = undefined
                    return res.status(SC.OK).json({ token, user })
                } else {
                    const encrypted_password = access_token + email
                    const userNew = new userModel({
                        email,
                        name: first_name,
                        lastname: last_name,
                        encrypted_password
                    })
                    userNew.save((err, data) => {
                        if (err) {
                            return res.status(SC.BAD_REQUEST).json({
                                error: 'Failed to add user in DB'
                            })
                        } else {
                            const expiryTime = new Date()
                            expiryTime.setMonth(expiryTime.getMonth() + 6)
                            const exp = parseInt(expiryTime.getTime() / 1000)

                            const token = jwt.sign(
                                { _id: data._id, exp },
                                process.env.SECRET
                            )

                            res.cookie('Token', token, {
                                expire: new Date() + 9999
                            })

                            data.salt = undefined
                            data.__v = undefined
                            return res.status(SC.OK).json({
                                message:
                                    'User Logged in Successfully from Facebook!',
                                token,
                                user: data
                            })
                        }
                    })
                }
            })
        }
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('User Logged in from Facebook!')
    }
}

module.exports = {
    signup,
    signin,
    update,
    signout,
    googleLogin,
    facebookLogin
}
