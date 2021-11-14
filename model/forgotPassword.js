/**
 * @author krish
 */

const mongoose = require('mongoose')

const forgotPasswordSchema = new mongoose.Schema(
    {
        userId: mongoose.Schema.ObjectId,
        name: {
            type: String,
            default: null
        },
        forgotPasswordUUID: {
            type: String
        },
        validTill: {
            type: Date
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model(
    'forgotPassword',
    forgotPasswordSchema,
    'forgotPassword'
)
