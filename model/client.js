/**
 * @author krish
 */

const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            maxlength: 30,
            trim: true,
            required: true
        },
        logo: {
            data: Buffer,
            contentType: String
        },
        url: String
    },
    { timestamps: true }
)

module.exports = mongoose.model('client', clientSchema, 'client')
