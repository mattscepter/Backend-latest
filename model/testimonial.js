/**
 * @author krish
 */

const mongoose = require('mongoose')

const testimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            maxlength: 30,
            trim: true,
            required: true
        },
        role: {
            type: String,
            maxlength: 30,
            trim: true,
            required: true
        },
        description: {
            type: String,
            maxlength: 100,
            trim: true,
            required: true
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        isApproved: {
            type: Boolean,
            default: false
        },
        priority: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('testimonial', testimonialSchema, 'testimonial')
