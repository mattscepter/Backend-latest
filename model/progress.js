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
                completedModules: [
                    {
                        type: new mongoose.Schema(
                            {
                                moduleId: mongoose.Schema.ObjectId
                            },
                            { timestamps: true }
                        )
                    }
                ],
                completedChapters: [
                    {
                        type: new mongoose.Schema(
                            {
                                chapterId: mongoose.Schema.ObjectId
                            },
                            { timestamps: true }
                        )
                    }
                ],
                currentModule: {
                    type: mongoose.Schema.ObjectId,
                    default: null
                },
                currentChapter: {
                    chapterId: {
                        type: mongoose.Schema.ObjectId,
                        default: null
                    },
                    currentChapterTimestamp: { type: Number, default: 0 },
                    currrentSlide: { type: Number, default: 0 }
                }
            }
        ]
    },
    { timestamps: true }
)
module.exports = mongoose.model('progress', progressSchema, 'progress')
