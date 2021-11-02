/**
 * @author krish
 */

const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema(
    {
        phoneNumber: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true
        },
        mapLocation: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('contact', contactSchema, 'contact')
