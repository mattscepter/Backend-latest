/**
 * @author krish
 */

const couponModel = require('../model/coupon')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const createCoupon = async (req, res) => {
    let result = {
        couponCode: '',
        validity: '',
        discount: 0,
        usage: 0
    }
    const { couponCode, validity, discount, usage } = req.body
    try {
        result.couponCode = couponCode
        result.validity = new Date(validity)
        result.discount = discount
        result.usage = usage

        await couponModel.findOne({ couponCode }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Coupon already found on DB!'
                })
            } else {
                const coupon = new couponModel(result)
                coupon.save((err, data) => {
                    if (err) {
                        logger(err, 'ERROR')
                        return res.status(SC.BAD_REQUEST).json({
                            error: 'Creating Coupon in DB is failed!'
                        })
                    }
                    res.status(SC.OK).json({
                        message: 'Coupon created successfully!',
                        data: data
                    })
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Create Coupon Function is Executed!')
    }
}

const updateCoupon = async (req, res) => {
    let result = req.body
    try {
        await couponModel
            .updateOne(
                { _id: req.params.couponId },
                {
                    $set: result
                }
            )
            .then(() => {
                res.status(SC.OK).json({
                    message: 'Coupon Updated Successfully!'
                })
            })
            .catch((err) => {
                res.status(SC.INTERNAL_SERVER_ERROR).json({
                    error: 'Coupon Updation Failed!'
                })
                logger(err, 'ERROR')
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Update Coupon Function is Executed!')
    }
}

const getCouponById = async (req, res) => {
    try {
        await couponModel
            .findOne({ _id: req.params.couponId })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'Coupon fetched successfully!',
                        data: data
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No Coupons found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Coupon Function is Executed')
    }
}

const getAllCoupons = async (req, res) => {
    try {
        await couponModel.find({}).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                res.status(SC.OK).json({
                    message: 'Coupons fetched successfully!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No Coupons found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All Coupons Function is Executed')
    }
}

const checkValidity = async (req, res) => {
    const { couponCode } = req.body
    try {
        await couponModel.findOne({ couponCode }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                if (
                    data.usage === 0 ||
                    new Date() > new Date(data.validity) ||
                    data.usage < 0
                ) {
                    res.status(SC.NOT_FOUND).json({
                        error: 'Coupon has expired'
                    })
                } else {
                    res.status(SC.OK).json({
                        message: 'Coupons Applied Successfully',
                        data: data
                    })
                }
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'Invalid Coupon'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Check Coupon Function is Executed')
    }
}

const applyCoupon = async (req, res) => {
    const { couponCode } = req.body
    try {
        await couponModel.findOne({ couponCode }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                couponModel
                    .updateOne({ _id: data._id }, { $inc: { usage: -1 } })
                    .then(() => {
                        res.status(SC.OK).json({
                            message: 'Coupons Applied Successfully'
                        })
                    })
                    .catch((error) => {
                        logger(error, 'ERROR')
                        res.status(SC.OK).json({
                            message: 'Error!! Try again'
                        })
                    })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'Invalid Coupon'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Apply Coupon Function is Executed')
    }
}

const deleteCouponById = async (req, res) => {
    try {
        await couponModel
            .findByIdAndDelete({ _id: req.params.couponId })
            .exec((err, data) => {
                if (err) {
                    res.status(SC.BAD_REQUEST).json({
                        error: 'Deleting coupon from DB is failed!'
                    })
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'Coupon deleted successfully!'
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No coupons found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete Coupon Function is Executed!')
    }
}

module.exports = {
    createCoupon,
    updateCoupon,
    getCouponById,
    getAllCoupons,
    deleteCouponById,
    applyCoupon,
    checkValidity
}
