/**
 * @author krish
 */

const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema(
    {
        email: String,
        isApproved: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model(
    'subscription',
    subscriptionSchema,
    'subscription'
)
