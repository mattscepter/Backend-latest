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
        discount: 0
    }
    const { couponCode, validity, discount } = req.body
    try {
        result.couponCode = couponCode
        result.validity = new Date(validity)
        result.discount = discount

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
    deleteCouponById
}
