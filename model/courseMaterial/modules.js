/**
 * @author utkarsh
 */

const mongoose = require('mongoose')

const moduleSchema = new mongoose.Schema(
    {
        courseId: mongoose.Schema.ObjectId,
        name: {
            type: String,
            default: null
        },
        description: {
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
module.exports = mongoose.model('module', moduleSchema, 'module')
