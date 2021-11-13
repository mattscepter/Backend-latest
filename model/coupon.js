/**
 * @author krish
 */

const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema(
    {
        couponCode: {
            type: String,
            required: true,
            trim: true
        },
        validity: {
            type: Date,
            required: true,
            trim: true
        },
        usage: {
            type: Number,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('coupons', couponSchema, 'coupons')
