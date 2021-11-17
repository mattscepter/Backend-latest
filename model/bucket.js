/**
 * @author krish
 */

const mongoose = require('mongoose')

const bucketSchema = new mongoose.Schema(
    {
        docId: {
            type: String,
            required: true
        },
        bucketName: {
            type: String,
            required: true,
            trim: true
        },
        noOfStudents: {
            type: Number,
            default: 0
        },
        students: [
            {
                studentId: mongoose.Schema.ObjectId
            }
        ],
        createdBy: {
            userId: {
                type: mongoose.Schema.ObjectId
            },
            userName: {
                type: String
            }
        },
        status: {
            type: String,
            default: 'PENDING'
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('bucket', bucketSchema, 'bucket')
