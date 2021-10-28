/**
 * @author krish
 */

const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema(
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
            trim: true,
            required: true
        },
        photo: {
            data: Buffer,
            contentType: String
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('team', teamSchema, 'team')
