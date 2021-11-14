/**
 * @author krish
 */

const messageModel = require('../model/message')
const userModel = require('../model/user')
const mongoose = require('mongoose')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const createMessage = async (req, res) => {
    let result = {
        userId: '',
        userName: '',
        position: '',
        subject: '',
        message: '',
        recipients: []
    }
    const { subject, message, recipients } = req.body
    const userId = req.auth._id
    try {
        await userModel.findOne({ _id: userId }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }

            if (data) {
                result.userId = userId
                data.name !== null
                    ? (result.userName = data.name)
                    : (result.userName = 'unknown')
                data.role !== null
                    ? (result.position =
                          data.role === 2 ? 'Admin' : 'Instructor')
                    : (result.position = 'unknown')
                result.subject = subject
                result.message = message
                result.recipients = recipients

                const messages = new messageModel(result)
                messages.save((err, data) => {
                    if (err) {
                        console.log(err)
                        res.status(SC.BAD_REQUEST).json({
                            error: 'Saving data in DB failed!'
                        })
                        logger(err, 'ERROR')
                    }
                    res.status(SC.OK).json({
                        message: 'Messages added sucessfully!',
                        data: data
                    })
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No user found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Create Message Function Executed')
    }
}

//label for pagination
const label = {
    totalDocs: 'totalMessages',
    docs: 'messages',
    limit: 'perPage',
    page: 'currentPageNo',
    nextPage: 'nextPageNo',
    prevPage: 'prevPageNo',
    totalPages: 'pageCount'
}

const getUserMessage = async (req, res) => {
    const id = req.params.userId
    let options = {
        page: 1,
        limit: 10,
        customLabels: label
    }
    req.query.page !== undefined ? (options.page = req.query.page) : null
    req.query.limit !== undefined ? (options.limit = req.query.limit) : null
    const userId = mongoose.Types.ObjectId(id)

    try {
        messageModel.paginate(
            {
                recipients: {
                    $elemMatch: {
                        userId: userId
                    }
                }
            },
            options,
            (err, result) => {
                result.messages.forEach((val) => {
                    val.recipients = undefined
                    val.__v = undefined
                })
                if (err) {
                    res.status(SC.BAD_REQUEST).json({
                        error: 'Getting user message from DB is failed!'
                    })
                    logger(err, 'ERROR')
                }
                res.status(SC.OK).send({
                    message: 'User messages are fetched successfully',
                    data: result
                })
            }
        )
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get User Message Function Executed')
    }
}

const getAllMessage = async (req, res) => {
    let options = {
        page: 1,
        limit: 10,
        customLabels: label,
        sort: { createdAt: -1 }
    }
    req.query.page !== undefined ? (options.page = req.query.page) : null
    req.query.limit !== undefined ? (options.limit = req.query.limit) : null

    try {
        messageModel.paginate({}, options, (err, result) => {
            result.messages.forEach((val) => {
                val.recipients = undefined
                val.__v = undefined
            })
            if (err) {
                res.status(SC.BAD_REQUEST).json({
                    error: 'Getting messages from DB is failed!'
                })
                logger(err, 'ERROR')
            }
            res.status(SC.OK).send({
                message: 'All messages are fetched successfully',
                data: result
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All Messages Function Executed')
    }
}

const deleteMessageById = async (req, res) => {
    try {
        await messageModel
            .deleteOne({ _id: req.params.id })
            .exec((err, data) => {
                if (err) {
                    res.status(SC.BAD_REQUEST).json({
                        error: 'Getting  messages from DB is failed!'
                    })
                    logger(err, 'ERROR')
                }
                if (data.deletedCount) {
                    res.status(SC.OK).json({
                        message: 'Messages deleted successfully!'
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No messages found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete Message Function is Executed!')
    }
}

const deleteUserFromMessage = async (req, res) => {
    const id = req.params.id
    const userId = req.query.userId

    try {
        await messageModel
            .updateOne(
                {
                    _id: id
                },
                {
                    $pull: {
                        recipients: {
                            userId: {
                                $in: userId
                            }
                        }
                    }
                }
            )
            .then(() => {
                res.status(SC.OK).json({
                    message: 'User deleted successfully from message!'
                })
            })
            .catch((err) => {
                res.status(SC.BAD_REQUEST).json({
                    error: 'Deleting user from message is failed!'
                })
                logger(err, 'ERROR')
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete User From Message Function Executed')
    }
}

const deleteUserFromAllMessages = async (req, res) => {
    const userId = req.params.userId

    try {
        await messageModel
            .updateMany(
                {
                    recipients: {
                        $elemMatch: {
                            userId: userId
                        }
                    }
                },
                {
                    $pull: {
                        recipients: {
                            userId: {
                                $in: userId
                            }
                        }
                    }
                }
            )
            .then(() => {
                res.status(SC.OK).json({
                    message: 'User deleted successfully from all messages!'
                })
            })
            .catch((err) => {
                res.status(SC.BAD_REQUEST).json({
                    error: 'Deleting user from messages is failed!'
                })
                logger(err, 'ERROR')
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete User From All Messages Function Executed')
    }
}

const deleteAllMessages = async (req, res) => {
    try {
        await messageModel.deleteMany({}).exec((err, data) => {
            if (err) {
                res.status(SC.BAD_REQUEST).json({
                    error: 'Getting all messages from DB is failed!'
                })
                logger(err, 'ERROR')
            }
            if (data.deletedCount) {
                res.status(SC.OK).json({
                    message: 'All messages deleted successfully!'
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No messages found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete All Messages Function is Executed!')
    }
}

module.exports = {
    createMessage,
    getUserMessage,
    getAllMessage,
    deleteMessageById,
    deleteUserFromMessage,
    deleteUserFromAllMessages,
    deleteAllMessages
}
