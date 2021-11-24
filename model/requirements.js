/**
 * @author krish
 */

const mongoose = require('mongoose')

const requirementsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        price: Number
    },
    { timestamps: true }
)

module.exports = mongoose.model(
    'requirements',
    requirementsSchema,
    'requirements'
)
