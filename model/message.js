/**
 * @author krish
 */

const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const messageSchema = new mongoose.Schema(
    {
        userId: mongoose.Schema.ObjectId,
        userName: {
            type: String,
            required: true,
            trim: true
        },
        position: {
            type: String,
            required: true,
            trim: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        recipients: [
            {
                userId: mongoose.Schema.ObjectId
            }
        ]
    },
    { timestamps: true }
)

messageSchema.plugin(paginate)
module.exports = mongoose.model('message', messageSchema, 'message')
