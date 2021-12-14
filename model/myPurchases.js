/**
 * @author utkarsh
 */

const mongoose = require('mongoose')

const myPurchaseSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.ObjectId },
        itemOriginalPrice: {
            type: Number
        },
        coupon: {
            type: String,
            default: null
        },
        itemType: {
            type: String,
            trim: true
        },
        itemId: {
            type: mongoose.Schema.ObjectId
        },
        itemName: {
            type: String,
            trim: true
        },
        itemDesc: {
            type: String,
            trim: true
        },
        paymentObj: {}
    },
    { timestamps: true }
)

module.exports = mongoose.model('myPurchases', myPurchaseSchema, 'myPurchases')
