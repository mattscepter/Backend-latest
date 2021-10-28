/**
 * @author krish
 */

const mongoose = require('mongoose')

const contactUserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        message: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('contactUser', contactUserSchema, 'contactUser')
