/**
 * @author utkarsh
 */

const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: null
        },
        description: {
            type: String,
            default: null
        },
        price: {
            type: String,
            default: null
        },
        duration: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
)
module.exports = mongoose.model('course', courseSchema, 'course')
