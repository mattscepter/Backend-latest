/**
 * @author utkarsh
 */

const purchaseModel = require('../model/myPurchases')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const getMyPurchases = async (req, res) => {
    const userId = req.auth._id
    try {
        await purchaseModel
            .find({ userId })
            .then((data) => {
                res.status(SC.OK).json({
                    message: 'Fetched my purchase successfully',
                    data: data
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                res.status(SC.BAD_REQUEST).json({
                    error: 'Error fetching my purchases'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Fetch My Purchases Function is Executed')
    }
}

const getUsersPurchases = async (req, res) => {
    const userId = req.params.id
    try {
        await purchaseModel
            .find({ userId })
            .then((data) => {
                res.status(SC.OK).json({
                    message: 'Fetched users purchase successfully',
                    data: data
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                res.status(SC.BAD_REQUEST).json({
                    error: 'Error fetching users purchases'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Fetch Users Purchases Function is Executed')
    }
}

const makePurchase = async (req, res) => {
    const userId = req.auth._id
    const {
        itemType,
        itemId,
        itemDesc,
        itemName,
        paymentObj,
        itemOriginalPrice,
        coupon
    } = req.body
    try {
        const purchase = new purchaseModel({
            userId,
            itemId,
            itemType,
            itemDesc,
            itemName,
            paymentObj,
            itemOriginalPrice,
            coupon
        })
        purchase
            .save()
            .then(() => {
                res.status(SC.OK).json({
                    message: `Purchase made successfully!`
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                res.status(SC.BAD_REQUEST).json({
                    error: 'Error making purchase'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Fetch Users Purchases Function is Executed')
    }
}

module.exports = {
    getMyPurchases,
    getUsersPurchases,
    makePurchase
}
