/**
 * @author krish
 */

const mongoose = require('mongoose')

const classSchema = new mongoose.Schema(
    {
        instructorId: mongoose.Schema.ObjectId,
        docId: {
            type: String,
            required: true
        },
        instructorName: {
            type: String,
            trim: true
        },
        classname: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: String,
            required: true
        },
        location: {
            type: String,
            trim: true,
            default: null
        },
        noOfSpots: {
            type: Number,
            required: true
        },
        students: [
            {
                studentId: mongoose.Schema.ObjectId,
                attendence: {
                    type: Boolean,
                    default: null
                },
                note: {
                    type: String,
                    trim: true,
                    default: null
                }
            }
        ]
    },
    { timestamps: true }
)

module.exports = mongoose.model('class', classSchema, 'class')
