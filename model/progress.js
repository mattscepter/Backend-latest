/**
 * @author utkarsh
 */

const mongoose = require('mongoose')

const progressSchema = new mongoose.Schema(
    {
        userId: mongoose.Schema.ObjectId,
        courses: [
            {
                courseId: { type: mongoose.Schema.ObjectId, default: null },
                currentModule: {
                    type: mongoose.Schema.ObjectId,
                    default: null
                },
                currentChapter: {
                    type: mongoose.Schema.ObjectId,
                    default: null
                },
                currentChapterTimestamp: { type: Number, default: 0 }
            }
        ]
    },
    { timestamps: true }
)
module.exports = mongoose.model('progress', progressSchema, 'progress')
