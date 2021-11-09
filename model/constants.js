/**
 * @author utkarsh
 */

const mongoose = require('mongoose')

const constantsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('constants', constantsSchema, 'constants')
