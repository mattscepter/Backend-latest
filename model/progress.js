/**
 * @author utkarsh
 */

const mongoose = require('mongoose')

const progressSchema = new mongoose.Schema(
    {
        userId: mongoose.Schema.ObjectId,
        courses: [
            {
                courseStatus: {
                    startedDate: {
                        type: Date,
                        default: new Date()
                    },
                    completedDate: {
                        type: Date,
                        default: null
                    },
                    completedStatus: {
                        type: Boolean,
                        default: false
                    }
                },
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
                    type: new mongoose.Schema(
                        {
                            moduleId: {
                                type: mongoose.Schema.ObjectId,
                                default: null
                            }
                        },
                        { timestamps: true }
                    ),
                    default: null
                },
                currentChapter: {
                    type: new mongoose.Schema(
                        {
                            chapterId: {
                                type: mongoose.Schema.ObjectId,
                                default: null
                            },
                            currrentSlide: { type: Number, default: 0 }
                        },
                        { timestamps: true }
                    ),
                    default: null
                },
                currentChapterTimestamp: {
                    type: Number,
                    default: 0
                }
            }
        ]
    },
    { timestamps: true }
)
module.exports = mongoose.model('progress', progressSchema, 'progress')
