/**
 * @author krish
 */

const subscriptionModel = require('../model/subscription')
const { validationResult } = require('express-validator')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const saveSubscription = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(SC.WRONG_ENTITY).json({
            error: errors.array()[0].msg
        })
    }
    const email = req.body.email

    if (!email) {
        res.status(SC.BAD_REQUEST).json({
            error: 'Please include E-Mail!'
        })
    } else {
        const subscription = new subscriptionModel({ email })

        try {
            await subscriptionModel.findOne({ email }).exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }

                if (!data) {
                    subscription.save((err, data) => {
                        if (err) {
                            logger(err, 'ERROR')
                            res.status(SC.BAD_REQUEST).json({
                                error: 'Saving data in DB failed!'
                            })
                        }
                        res.status(SC.OK).json({
                            message: 'Subscription saved successfully!',
                            data: data
                        })
                    })
                } else {
                    res.status(SC.BAD_REQUEST).json({
                        message: 'Email is already available in DB!'
                    })
                }
            })
        } catch (err) {
            logger(err, 'ERROR')
        } finally {
            logger('Save Subscription  Function is Executed')
        }
    }
}

const getSubscriptionById = async (req, res) => {
    try {
        await subscriptionModel
            .findOne({ _id: req.params.id })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'Subscription Fetched successfully from DB!',
                        data: data
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        message: 'No subscription found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Subscription Function is Executed')
    }
}

const getAllSubscriptions = async (req, res) => {
    try {
        await subscriptionModel.find({}).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                res.status(SC.OK).json({
                    message: 'Subscriptions Fetched successfully from DB!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    message: 'No subscription found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All Subscription Function is Executed')
    }
}

const updateSubscriptionById = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(SC.WRONG_ENTITY).json({
            error: errors.array()[0].msg
        })
    }
    try {
        await subscriptionModel
            .findOne({ _id: req.params.id })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (!data) {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No subscription found!'
                    })
                } else {
                    let { email, isApproved } = req.body
                    if (data.email === email) {
                        return res.status(SC.BAD_REQUEST).json({
                            error: 'Please enter different E-Mail address to update~'
                        })
                    }
                    !email ? (email = data.email) : email
                    isApproved === undefined
                        ? (isApproved = data.isApproved)
                        : isApproved

                    subscriptionModel
                        .updateOne(
                            { _id: req.params.id },
                            {
                                $set: {
                                    email: email,
                                    isApproved: isApproved
                                }
                            }
                        )
                        .then(() => {
                            res.status(SC.OK).json({
                                message: 'User Updated Successfully!'
                            })
                        })
                        .catch((err) => {
                            logger(err, 'ERROR')
                            res.status(SC.BAD_REQUEST).json({
                                error: 'User Updation Failed!'
                            })
                        })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Update Subscription Function is Executed')
    }
}

const deleteSubscriptionById = async (req, res) => {
    try {
        await subscriptionModel
            .findByIdAndDelete({ _id: req.params.id })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data.deletedCount) {
                    res.status(SC.OK).json({
                        message: 'Subscription document deleted successfully!'
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        message: 'No subscription found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete Subscription Function is Executed')
    }
}

module.exports = {
    saveSubscription,
    getSubscriptionById,
    getAllSubscriptions,
    updateSubscriptionById,
    deleteSubscriptionById
}
