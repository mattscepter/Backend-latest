/**
 * @author krish
 */

const mongoose = require('mongoose')

const calenderEventSchema = new mongoose.Schema(
    {
        users: [
            {
                userId: mongoose.Schema.ObjectId,
                userName: {
                    type: String,
                    required: true,
                    trim: true
                }
            }
        ],
        title: {
            type: String,
            required: true,
            trim: true
        },
        startTime: {
            type: String,
            required: true,
            trim: true
        },
        endTime: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model(
    'calenderEvent',
    calenderEventSchema,
    'calenderEvent'
)
