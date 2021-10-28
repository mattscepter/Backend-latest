/**
 * @author krish
 */

const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const userActivitySchema = new mongoose.Schema(
    {
        userId: mongoose.Schema.ObjectId,
        userName: {
            type: String,
            required: true,
            trim: true
        },
        activityDetails: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
)

userActivitySchema.plugin(mongoosePaginate)
module.exports = mongoose.model(
    'userActivity',
    userActivitySchema,
    'userActivity'
)
