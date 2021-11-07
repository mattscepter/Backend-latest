/**
 * @author utkarsh
 */

const mongoose = require('mongoose')

const chapterSchema = new mongoose.Schema(
    {
        courseId: mongoose.Schema.ObjectId,
        moduleId: mongoose.Schema.ObjectId,
        name: {
            type: String,
            default: null
        },
        description: {
            type: String,
            default: null
        },
        duration: {
            type: Number,
            default: 0
        },
        slides: {
            type: [
                {
                    type: new mongoose.Schema({
                        title: {
                            type: String,
                            default: null
                        },
                        text: {
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
                        question: {
                            type: String,
                            default: null
                        },
                        optionA: {
                            type: String,
                            default: null
                        },
                        optionB: {
                            type: String,
                            default: null
                        },
                        optionC: {
                            type: String,
                            default: null
                        },
                        optionD: {
                            type: String,
                            default: null
                        },
                        correctOpt: {
                            type: String,
                            default: null
                        }
                    })
                }
            ],
            default: []
        }
    },
    { timestamps: true }
)
module.exports = mongoose.model('chapter', chapterSchema, 'chapter')
