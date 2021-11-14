/**
 * @author krish
 */

const userModel = require('../model/user.js')
const forgotPasswordModel = require('../model/forgotPassword')
const jwt = require('jsonwebtoken')
const { validationResult: validate } = require('express-validator')
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))
const { OAuth2Client: OAuth } = require('google-auth-library')
const nodemailer = require('nodemailer')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')
const { v4: uuid } = require('uuid')
const moment = require('moment')

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

const updateRole = async (req, res) => {
    const { role } = req.body
    try {
        await userModel
            .updateOne({ _id: req.params.userId }, { role })
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
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger(`User Role Update Function Executed`)
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

const changePassword = async (req, res) => {
    const userId = req.auth._id
    const errors = validate(req)
    if (!errors.isEmpty()) {
        return res.status(SC.WRONG_ENTITY).json({
            error: errors.array()[0].msg
        })
    }
    const { oldPassword, newPassword } = req.body
    try {
        if (oldPassword === newPassword) {
            return res.status(SC.WRONG_ENTITY).json({
                error: 'Old and new Password are same!'
            })
        }
        await userModel.findOne({ _id: userId }, (err, user) => {
            if (err || !user) {
                return res.status(SC.NOT_FOUND).json({
                    error: "User id doesn't exist in DB!"
                })
            }
            if (!user.authenticate(oldPassword)) {
                return res.status(SC.UNAUTHORIZED).json({
                    error: 'Oops!, Your old password is wrong!!'
                })
            } else {
                userModel
                    .updateOne(
                        { _id: userId },
                        {
                            $set: {
                                encrypted_password:
                                    user.securePassword(newPassword)
                            }
                        }
                    )
                    .then(() => {
                        res.status(SC.OK).json({
                            message: 'User Password changed successfully!'
                        })
                    })
                    .catch(() => {
                        res.status(SC.BAD_REQUEST).json({
                            error: 'Password Updation Failed!'
                        })
                    })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger(`Forgot Password Function  Executed`)
    }
}

const forgotPassword = async (req, res) => {
    const email = req.body.email
    const url = req.body.url
    const transporter = nodemailer.createTransport({
        service: 'google',
        pool: true,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN
        }
    })

    await userModel.findOne({ email }).exec((err, user) => {
        if (err) {
            logger(err, 'ERROR')
        }
        if (user) {
            const randomId = uuid.URL
            const link = `${url}/forgot-pass/${randomId}`
            let mailOptions = {
                from: '"Argus security" <karshchaud@gmail.com>',
                to: user?.email,
                subject: 'Forgot Password',
                text: 'New Message',
                html: `
                <h1>Click below link to reset your password</h1>
                <a href=${link}>click here</a>
                `
            }
            forgotPasswordModel
                .findOne({ userId: user._id })
                .exec((err, data) => {
                    if (err) {
                        logger(err, 'ERROR')
                    }
                    const validity = moment().set(
                        'hour',
                        moment().get('hour') + 1
                    )

                    if (data && moment().diff(data?.validTill, 'minute') <= 0) {
                        res.status(SC.BAD_REQUEST).json({
                            error: 'Token has already been sent. Check your mail'
                        })
                    } else {
                        const result = {
                            userId: user?._id,
                            name: user?.name,
                            forgotPasswordUUID: randomId,
                            validTill: validity
                        }
                        transporter
                            .sendMail(mailOptions)
                            .then((info) => {
                                const forgotPassword = new forgotPasswordModel(
                                    result
                                )
                                forgotPassword.save((err) => {
                                    if (err) {
                                        return res.status(SC.BAD_REQUEST).json({
                                            error: 'Failed to update forgot password!'
                                        })
                                    }
                                    res.status(SC.OK).json({
                                        message:
                                            'Forgot Password UUID created succeffully and url link has been sent to the user!'
                                    })
                                })

                                logger(`Message sent: ${info.messageId}`)
                            })
                            .catch((error) => {
                                logger(error, 'ERROR')
                                res.status(SC.BAD_REQUEST).json({
                                    error: 'Forgot Password failed!'
                                })
                            })
                    }
                })
        } else {
            return res.status(SC.NOT_FOUND).json({
                error: 'User Not Found!'
            })
        }
    })
}

const forgotPasswordChange = async (req, res) => {
    const forgotPasswordUUID = req.params.uuid
    const errors = validate(req)
    if (!errors.isEmpty()) {
        return res.status(SC.WRONG_ENTITY).json({
            error: errors.array()[0].msg
        })
    }
    const { password } = req.body
    try {
        await forgotPasswordModel
            .findOne({ forgotPasswordUUID })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    userModel.findOne({ _id: data?.userId }, (err, user) => {
                        if (err || !user) {
                            return res.status(SC.NOT_FOUND).json({
                                error: "User id doesn't exist in DB!"
                            })
                        }
                        userModel
                            .updateOne(
                                { _id: data?.userId },
                                {
                                    $set: {
                                        encrypted_password:
                                            user.securePassword(password)
                                    }
                                }
                            )
                            .then(() => {
                                res.status(SC.OK).json({
                                    message:
                                        'User Password changed successfully!'
                                })
                                forgotPasswordModel
                                    .deleteOne({ forgotPasswordUUID })
                                    .then(() => {
                                        logger(
                                            'Forgot Password UUID has been deleted!'
                                        )
                                    })
                                    .catch((err) => {
                                        logger(err, 'ERROR')
                                    })
                            })
                            .catch(() => {
                                res.status(SC.BAD_REQUEST).json({
                                    error: 'Password Updation Failed!'
                                })
                            })
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'Invalid token'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger(`Forgot Password Change Function Executed`)
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
    changePassword,
    forgotPassword,
    forgotPasswordChange,
    update,
    updateRole,
    signout,
    googleLogin,
    facebookLogin
}
