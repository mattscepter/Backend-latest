/**
 * @author krish
 */

const userActivityModel = require('../model/userActivity')
const userModel = require('../model/user')
const mongoose = require('mongoose')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const createActivity = async (req, res) => {
    let result = {
        userId: '',
        userName: '',
        activityDetails: '',
        createdBy: ''
    }
    let userId = req.params.userId
    const { activityDetails, admin } = req.body
    try {
        await userModel.findOne({ _id: userId }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                result.userId = userId
                result.userName = data.name
                result.activityDetails = activityDetails
                admin !== undefined && admin
                    ? (result.createdBy = admin)
                    : (result.createdBy = data.name)

                const activityModel = new userActivityModel(result)
                activityModel.save((err, data) => {
                    if (err) {
                        logger(err, 'ERROR')
                        return res.status(SC.BAD_REQUEST).json({
                            error: 'Creating Activity in DB is failed!'
                        })
                    }
                    res.status(SC.OK).json({
                        message: 'User Activity created successfully!',
                        data: data
                    })
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No User found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Create Acitivity Function is Executed!')
    }
}

//label for pagination
const label = {
    totalDocs: 'totalActivities',
    docs: 'activities',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'nextPageNo',
    prevPage: 'prevPageNo',
    totalPages: 'pageCount'
}

const getUserAvtivity = async (req, res) => {
    let options = {
        page: 1,
        limit: 10,
        customLabels: label
    }

    req.query.page !== undefined ? (options.page = req.query.page) : null
    req.query.limit !== undefined ? (options.limit = req.query.limit) : null
    const userId = req.auth._id

    try {
        await userActivityModel.paginate({ userId }, options, (err, result) => {
            if (err) {
                res.status(SC.BAD_REQUEST).json({
                    error: 'Getting user activity from DB is failed!'
                })
                logger(err, 'ERROR')
            }
            res.status(SC.OK).send({
                message: 'User activity is fetched successfully',
                data: result
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get User Acitivity Function is Executed!')
    }
}

const getOtherUserActivity = async (req, res) => {
    let options = {
        page: 2,
        limit: 10,
        customLabels: label
    }
    let userId
    if (req.query.userId === undefined) {
        res.status(SC.BAD_REQUEST).json({
            error: 'Please pass userId as a query parameter'
        })
    } else {
        userId = req.query.userId
    }
    req.query.page !== undefined ? (options.page = req.query.page) : null
    req.query.limit !== undefined ? (options.limit = req.query.limit) : null

    try {
        await userActivityModel.paginate({ userId }, options, (err, result) => {
            if (err) {
                res.status(SC.BAD_REQUEST).json({
                    error: 'Getting user activity from DB is failed!'
                })
                logger(err, 'ERROR')
            }
            res.status(SC.OK).send({
                message: 'User activity is fetched successfully',
                data: result
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Other User Activity Function is Executed!')
    }
}

const getAllUserActivities = async (req, res) => {
    let result
    let options = {
        page: 2,
        limit: 10,
        customLabels: label
    }
    req.query.page !== undefined ? (options.page = req.query.page) : null
    req.query.limit !== undefined ? (options.limit = req.query.limit) : null

    try {
        if (req.query.userId === undefined) {
            result = await userActivityModel.find({}).sort({ createdAt: -1 })
        } else {
            const userId = mongoose.Types.ObjectId(req.query.userId)
            result = await userActivityModel
                .aggregate([
                    {
                        $match: {
                            userId: userId
                        }
                    },
                    {
                        $group: {
                            _id: {
                                userId: '$userId',
                                userName: '$userName'
                            },
                            activities: {
                                $push: {
                                    activityDetails: '$activityDetails',
                                    createdAt: {
                                        $dateToString: {
                                            date: '$createdAt',
                                            timezone: 'Asia/Kolkata'
                                        }
                                    },
                                    updatedAt: {
                                        $dateToString: {
                                            date: '$updatedAt',
                                            timezone: 'Asia/Kolkata'
                                        }
                                    }
                                }
                            }
                        }
                    }
                ])
                .sort({ _id: -1 })
        }

        if (result.length) {
            res.status(SC.OK).send({
                message: 'All user activities fetched successfully',
                data: result
            })
        } else {
            res.status(SC.NOT_FOUND).json({
                error: 'No activites found!'
            })
        }
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All User Activities Function is Executed!')
    }
}

const deleteActivityById = async (req, res) => {
    try {
        await userActivityModel
            .findByIdAndDelete({ _id: req.params.id })
            .exec((err, data) => {
                if (err) {
                    res.status(SC.BAD_REQUEST).json({
                        error: 'Deleting user activity from DB is failed!'
                    })
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'Activity deleted successfully!'
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No activities found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete User Activity Function is Executed!')
    }
}

const deleteAllActivitiesByUserId = async (req, res) => {
    try {
        await userActivityModel
            .deleteMany({ userId: req.params.userId })
            .exec((err, data) => {
                if (err) {
                    res.status(SC.BAD_REQUEST).json({
                        error: 'Getting all user activities from DB is failed!'
                    })
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'User activites deleted successfully!'
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No activities found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete All User Activities Function is Executed!')
    }
}

module.exports = {
    createActivity,
    getUserAvtivity,
    getOtherUserActivity,
    getAllUserActivities,
    deleteActivityById,
    deleteAllActivitiesByUserId
}
