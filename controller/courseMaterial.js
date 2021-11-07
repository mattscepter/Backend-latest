const courseModel = require('../model/courseMaterial/course')
const moduleModel = require('../model/courseMaterial/modules')
const chapterModel = require('../model/courseMaterial/chapters')
const userModel = require('../model/user.js')
const formidable = require('formidable')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')
const fs = require('fs')

const buyCourse = async (req, res) => {
    const { courseId } = req.body
    const authId = req.auth._id
    try {
        await userModel
            .updateOne({ _id: authId }, { $addToSet: { courses: courseId } })
            .then(() => {
                return res.status(SC.OK).json({
                    message: `Course added successfully!`
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Error adding course'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Add Course Function is Executed')
    }
}

const createCourse = async (req, res) => {
    const { name, description, price } = req.body
    try {
        const course = new courseModel({ name, description, price })
        await course
            .save()
            .then(() => {
                return res.status(SC.OK).json({
                    message: `Course created successfully!`
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Saving data in DB failed!'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Create Course Function is Executed')
    }
}

const getAllCourse = async (req, res) => {
    try {
        await courseModel
            .find({})
            .then((data) => {
                res.status(SC.OK).json({
                    message: `Course fetched successfully!`,
                    data: data
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Error fetching course'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Fetch All Course Function is Executed')
    }
}

const getCourse = async (req, res) => {
    const courseId = req.params.courseId
    try {
        await courseModel
            .findOne({ _id: courseId })
            .then((data) => {
                moduleModel.find({ courseId }).then((moduleData) => {
                    res.status(SC.OK).json({
                        message: `Course fetched successfully!`,
                        data: { Course: data, Module: moduleData }
                    })
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Error fetching course'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Fetch Course Function is Executed')
    }
}

const editCourse = async (req, res) => {
    const courseId = req.params.id
    const { name, description, price } = req.body

    try {
        await courseModel
            .updateOne({ _id: courseId }, { name, description, price })
            .then(() => {
                res.status(SC.OK).json({
                    message: `Course edited successfully`
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Error editing course'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Edit Course Function is Executed')
    }
}

const deleteCourse = async (req, res) => {
    const courseId = req.params.id
    try {
        await chapterModel
            .deleteMany({ courseId })
            .then(() => {
                moduleModel.deleteMany({ courseId }).then(() => {
                    courseModel.deleteOne({ _id: courseId }).then(() => {
                        res.status(SC.OK).json({
                            message: `Course deleted successfully`
                        })
                    })
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Error deleting course'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Delete Module Function is Executed')
    }
}

const createModule = async (req, res) => {
    const { name, description, courseId } = req.body
    try {
        await courseModel
            .findOne({ _id: courseId })
            .then(() => {
                const module = new moduleModel({ name, description, courseId })
                module
                    .save()
                    .then(() => {
                        return res.status(SC.OK).json({
                            message: `Module created successfully!`
                        })
                    })
                    .catch((err) => {
                        logger(err, 'ERROR')
                        return res.status(SC.BAD_REQUEST).json({
                            error: 'Saving data in DB failed!'
                        })
                    })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Course does not exists'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Create Module Function is Executed')
    }
}

const getModule = async (req, res) => {
    const id = req.params.id
    try {
        await moduleModel
            .findOne({ _id: id })
            .then((data) => {
                chapterModel
                    .find(
                        { moduleId: id },
                        { slides: { data: 0, contentType: 0 } }
                    )
                    .then((chapterData) => {
                        res.status(SC.OK).json({
                            message: `Course fetched successfully!`,
                            data: { Module: data, Chapters: chapterData }
                        })
                    })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Error fetching module'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Fetch Module Function is Executed')
    }
}

const editModule = async (req, res) => {
    const moduleId = req.params.id
    const { name, description } = req.body

    try {
        await moduleModel
            .updateOne({ _id: moduleId }, { name, description })
            .then(() => {
                res.status(SC.OK).json({
                    message: `Module edited successfully`
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Error editing module'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Edit Module Function is Executed')
    }
}

const deleteModule = async (req, res) => {
    const moduleId = req.params.id
    try {
        await chapterModel
            .deleteMany({ moduleId })
            .then(() => {
                moduleModel
                    .findOne({ _id: moduleId })
                    .then((data) => {
                        courseModel.updateOne(
                            { _id: data.courseId },
                            { $inc: { duration: -data.duration } }
                        )
                    })
                    .then(() => {
                        moduleModel.deleteOne({ _id: moduleId }).then(() => {
                            res.status(SC.OK).json({
                                message: `Module deleted successfully`
                            })
                        })
                    })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Error deleting module'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Delete Module Function is Executed')
    }
}

const createChapter = async (req, res) => {
    const { name, description, moduleId, courseId, duration } = req.body
    let increment = parseInt(duration)
    try {
        await moduleModel
            .findOne({ _id: moduleId })
            .then(() => {
                const module = new chapterModel({
                    name,
                    description,
                    moduleId,
                    courseId,
                    duration
                })
                module
                    .save()
                    .then(() => {
                        moduleModel
                            .updateOne(
                                { _id: moduleId },
                                { $inc: { duration: increment } }
                            )
                            .then(() => {
                                courseModel
                                    .updateOne(
                                        { _id: courseId },
                                        { $inc: { duration: increment } }
                                    )
                                    .then(() => {
                                        return res.status(SC.OK).json({
                                            message: `Chapter created successfully!`
                                        })
                                    })
                            })
                    })
                    .catch((err) => {
                        logger(err, 'ERROR')
                        return res.status(SC.BAD_REQUEST).json({
                            error: 'Saving data in DB failed!'
                        })
                    })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Module does not exists'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Create Chapter Function is Executed')
    }
}

const getChapter = async (req, res) => {
    const id = req.params.id
    try {
        await chapterModel
            .findOne({ _id: id }, { slides: { data: 0, contentType: 0 } })
            .then((data) => {
                res.status(SC.OK).json({
                    message: `Chapter fetched successfully!`,
                    data: data
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Error fetching chapters'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Fetch Module Function is Executed')
    }
}

const editChapter = async (req, res) => {
    const chapterId = req.params.id
    const { name, description, duration } = req.body

    try {
        chapterModel.findOne({ _id: chapterId }).then((data) => {
            chapterModel
                .updateOne({ _id: chapterId }, { name, description, duration })
                .then(() => {
                    moduleModel
                        .updateOne(
                            { _id: data.moduleId },
                            { $inc: { duration: duration - data.duration } }
                        )
                        .then(() => {
                            courseModel
                                .updateOne(
                                    { _id: data.courseId },
                                    {
                                        $inc: {
                                            duration: duration - data.duration
                                        }
                                    }
                                )
                                .then(() => {
                                    res.status(SC.OK).json({
                                        message: `Chapter edited successfully`
                                    })
                                })
                        })
                })
                .catch((err) => {
                    logger(err, 'ERROR')
                    return res.status(SC.BAD_REQUEST).json({
                        error: 'Error editing chapter'
                    })
                })
        })
    } catch (error) {
        logger(error, 'ERROR')
        return res.status(SC.BAD_REQUEST).json({
            error: 'Error editing chapter'
        })
    } finally {
        logger('Edit Chapter Function is Executed')
    }
}

const deleteChapter = async (req, res) => {
    const chapterId = req.params.id
    try {
        chapterModel.findOne({ _id: chapterId }).then((data) => {
            moduleModel
                .updateOne(
                    { _id: data.moduleId },
                    { $inc: { duration: -data.duration } }
                )
                .then(() => {
                    courseModel
                        .updateOne(
                            { _id: data.courseId },
                            { $inc: { duration: -data.duration } }
                        )
                        .then(() => {
                            chapterModel
                                .deleteOne({ _id: chapterId })
                                .then(() => {
                                    res.status(SC.OK).json({
                                        message: `Chapter deleted successfully`
                                    })
                                })
                                .catch((err) => {
                                    logger(err, 'ERROR')
                                    return res.status(SC.BAD_REQUEST).json({
                                        error: 'Error deleting chapter'
                                    })
                                })
                        })
                })
        })
    } catch (error) {
        logger(error, 'ERROR')
        return res.status(SC.BAD_REQUEST).json({
            error: 'Error deleting chapter'
        })
    } finally {
        logger('Delete Chapter Function is Executed')
    }
}

const addSlide = async (req, res) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true
    try {
        await form.parse(req, (err, fields, file) => {
            if (file.image) {
                if (file.image.size > 3145728) {
                    return res.status(400).json({
                        error: 'File size too big!'
                    })
                }
                chapterModel
                    .updateOne(
                        { _id: fields.chapterId },
                        {
                            $push: {
                                slides: {
                                    $each: [
                                        {
                                            title: fields.title,
                                            text: fields.text,
                                            data: fs.readFileSync(
                                                file.image.path
                                            ),
                                            contentType: file.image.type
                                        }
                                    ],
                                    $position: fields.position
                                }
                            }
                        }
                    )
                    .then(() => {
                        return res.status(SC.OK).json({
                            message: `Slide added successfully!`
                        })
                    })
                    .catch((err) => {
                        logger(err, 'ERROR')
                        return res.status(SC.BAD_REQUEST).json({
                            error: 'Error adding slide'
                        })
                    })
            }
        })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Create Slide Function is Executed')
    }
}

const addQuestion = async (req, res) => {
    const {
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOpt,
        chapterId,
        position
    } = req.body
    try {
        chapterModel
            .updateOne(
                { _id: chapterId },
                {
                    $push: {
                        slides: {
                            $each: [
                                {
                                    question,
                                    optionA,
                                    optionB,
                                    optionC,
                                    optionD,
                                    correctOpt
                                }
                            ],
                            $position: position
                        }
                    }
                }
            )
            .then(() => {
                return res.status(SC.OK).json({
                    message: `Slide added successfully!`
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Error adding slide'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Create Slide Function is Executed')
    }
}

const getSlideImage = async (req, res) => {
    const slideId = req.params.slideId
    const chapterId = req.params.chapterId
    try {
        await chapterModel
            .findOne(
                { _id: chapterId, slides: { $elemMatch: { _id: slideId } } },
                { _id: 0, 'slides.$': 1 }
            )
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.set('Content-Type', data?.slides[0]?.contentType)
                    return res.status(SC.OK).send(data?.slides[0]?.data)
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No Slide photo found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Silde Photo Function is Executed')
    }
}

const deleteSlide = async (req, res) => {
    const slideId = req.params.slideId
    const chapterId = req.params.chapterId
    try {
        await chapterModel
            .updateOne(
                { _id: chapterId },
                { $pull: { slides: { _id: slideId } } }
            )
            .then(() => {
                res.status(SC.OK).json({
                    message: `Slide deleted successfully`
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Error deleting slide'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Delete Slide Function is Executed')
    }
}

module.exports = {
    buyCourse,
    createCourse,
    createModule,
    createChapter,
    addSlide,
    addQuestion,
    getAllCourse,
    getCourse,
    getModule,
    getChapter,
    getSlideImage,
    deleteCourse,
    deleteModule,
    deleteChapter,
    deleteSlide,
    editChapter,
    editModule,
    editCourse
}
