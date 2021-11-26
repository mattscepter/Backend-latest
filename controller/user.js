const userModel = require('../model/user')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const getUserById = async (req, res, next, id) => {
    try {
        await userModel.findById(id).exec((err, user) => {
            if (err || !user) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'No user was found in DB!'
                })
            }
            req.profile = user
            next()
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get User By Id Function is Executed!')
    }
}

const getUser = (req, res) => {
    try {
        req.profile.salt = undefined
        req.profile.encry_password = undefined
        req.profile.__v = undefined
        return res.status(SC.OK).json({
            message: 'User Fetched Successfully!',
            data: req.profile
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get User Function is Executed!')
    }
}

const getAllUsers = async (req, res) => {
    try {
        await userModel
            .find({}, { salt: 0, encrypted_password: 0 })
            .exec((err, user) => {
                if (err || !user) {
                    return res.status(SC.NOT_FOUND).json({
                        error: 'No users were found in a DB!'
                    })
                }
                res.status(SC.OK).json({
                    message: 'User Fetched Successfully!',
                    data: user
                })
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All Users Function is Executed')
    }
}

const getAllStudents = async (req, res) => {
    try {
        await userModel.find({ role: 1 }).exec((err, user) => {
            if (err || !user) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'No users were found in a DB!'
                })
            }
            res.status(SC.OK).json({
                message: 'User Fetched Successfully!',
                data: user
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All Users Function is Executed')
    }
}

const getAllEmployees = async (req, res) => {
    try {
        await userModel.find({ role: 3 }).exec((err, user) => {
            if (err || !user) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'No users were found in a DB!'
                })
            }
            res.status(SC.OK).json({
                message: 'User Fetched Successfully!',
                data: user
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All Users Function is Executed')
    }
}

const getAllInsturctors = async (req, res) => {
    try {
        await userModel.find({ role: 4 }).exec((err, user) => {
            if (err || !user) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'No users were found in a DB!'
                })
            }
            res.status(SC.OK).json({
                message: 'User Fetched Successfully!',
                data: user
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All Users Function is Executed')
    }
}

const getUserByQuery = async (req, res) => {
    try {
        let query = req.body.query
        if (!query?.createdAt) {
            if (query?.courses.length === 0) {
                delete query.courses
                await userModel.find(query).exec((err, user) => {
                    if (err || !user) {
                        return res.status(SC.NOT_FOUND).json({
                            error: 'No users were found in a DB!'
                        })
                    }
                    res.status(SC.OK).json({
                        message: 'User Fetched Successfully!',
                        length: user?.length,
                        data: user
                    })
                })
            } else {
                let courses = req.body.query.courses
                delete query.courses
                await userModel
                    .find({ $and: [query, { courses: { $in: courses } }] })
                    .exec((err, user) => {
                        if (err || !user) {
                            return res.status(SC.NOT_FOUND).json({
                                error: 'No users were found in a DB!'
                            })
                        }
                        res.status(SC.OK).json({
                            message: 'User Fetched Successfully!',
                            length: user?.length,
                            data: user
                        })
                    })
            }
        } else {
            let createdAt = query.createdAt
            let nextDate = new Date(createdAt)
            nextDate.setDate(nextDate.getDate() + 1)
            delete query.createdAt
            if (query.courses.length === 0) {
                delete query.courses
                await userModel
                    .find({
                        $and: [
                            query,
                            {
                                createdAt: {
                                    $gte: new Date(
                                        new Date(createdAt).toDateString()
                                    ).toISOString(),
                                    $lt: new Date(
                                        new Date(nextDate).toDateString()
                                    ).toISOString()
                                }
                            }
                        ]
                    })
                    .exec((err, user) => {
                        if (err || !user) {
                            return res.status(SC.NOT_FOUND).json({
                                error: 'No users were found in a DB!'
                            })
                        }
                        res.status(SC.OK).json({
                            message: 'User Fetched Successfully!',
                            length: user?.length,
                            data: user
                        })
                    })
            } else {
                let courses = req.body.query.courses
                delete query.courses
                await userModel
                    .find({
                        $and: [
                            query,
                            { courses: { $in: courses } },
                            {
                                createdAt: {
                                    $gte: new Date(
                                        new Date(createdAt).toDateString()
                                    ).toISOString(),
                                    $lt: new Date(
                                        new Date(nextDate).toDateString()
                                    ).toISOString()
                                }
                            }
                        ]
                    })
                    .exec((err, user) => {
                        if (err || !user) {
                            return res.status(SC.NOT_FOUND).json({
                                error: 'No users were found in a DB!'
                            })
                        }
                        res.status(SC.OK).json({
                            message: 'User Fetched Successfully!',
                            length: user?.length,
                            data: user
                        })
                    })
            }
        }
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Search Users Function is Executed')
    }
}

const blockunblock = async (req, res) => {
    try {
        await userModel
            .updateOne({ _id: req.body.userId }, { blocked: req.body.block })
            .then(() => {
                if (req.body.block === true) {
                    res.status(SC.OK).json({
                        message: 'User Blocked Successfully!'
                    })
                } else if (req.body.block === false) {
                    res.status(SC.OK).json({
                        message: 'User UnBlocked Successfully!'
                    })
                } else {
                    return res.status(SC.NOT_FOUND).json({
                        error: 'Invalid value'
                    })
                }
            })
            .catch((err) => {
                logger(err, 'ERROR')
                return res.status(SC.NOT_FOUND).json({
                    error: 'Error blocking/unblocking user'
                })
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Search Users Function is Executed')
    }
}

module.exports = {
    getUserById,
    getUser,
    getAllUsers,
    getAllStudents,
    getAllEmployees,
    getAllInsturctors,
    getUserByQuery,
    blockunblock
}
