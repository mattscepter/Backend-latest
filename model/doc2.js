/**
 * @author utkarsh
 */

const mongoose = require('mongoose')

const docSchema = new mongoose.Schema(
    {
        userId: mongoose.Schema.ObjectId,
        username: {
            type: String,
            default: null
        },
        name: {
            type: String,
            default: null
        },
        data: {
            type: Buffer,
            default: null
        },
        contentType: {
            type: String,
            default: null
        },
        isApproved: {
            type: Boolean,
            default: null
        },
        note: {
            type: String,
            default: ''
        },
        createdAt: {
            type: String,
            default: new Date().toISOString()
        },
        updatedAt: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
)
module.exports = mongoose.model('userDocs2', docSchema, 'userDocs2')
