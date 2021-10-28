/**
 * @author krish
 */

const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema(
    {
        phoneNumber: String,
        address: String,
        email: String,
        mapLocation: String
    },
    { timestamps: true }
)

module.exports = mongoose.model('contact', contactSchema, 'contact')
