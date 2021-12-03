/**
 * @author utkarsh
 */

const progressModel = require('../model/progress')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const getAllProgress = async (req, res) => {
    try {
        await progressModel
            .find({})
            .then(() => {
                res.status(SC.OK).json({
                    message: 'Fetched all progress successfully'
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                res.status(SC.BAD_REQUEST).json({
                    error: 'Error fetching progress'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Fetch All Progress Function is Executed')
    }
}

const getProgress = async (req, res) => {
    const userId = req.auth._id
    try {
        await progressModel
            .find({ userId })
            .then((data) => {
                res.status(SC.OK).json({
                    message: 'Fetched progress successfully',
                    data: data
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                res.status(SC.BAD_REQUEST).json({
                    error: 'Error fetching progress'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Fetch Progress Function is Executed')
    }
}

const updateCurrentModule = async (req, res) => {
    const userId = req.auth._id
    const { chapterId, moduleId, duration, id } = req.body
    try {
        if (moduleId !== 'undefined') {
            await progressModel
                .findOneAndUpdate(
                    { userId, 'courses._id': id },
                    {
                        $set: {
                            'courses.$.currentModule': { moduleId },
                            'courses.$.currentChapter': { chapterId },
                            'courses.$.currentChapterTimestamp': duration
                        }
                    },
                    { new: true }
                )
                .then((data) => {
                    res.status(SC.OK).json({
                        message: 'Updated current module successfully',
                        data: data
                    })
                })
                .catch((err) => {
                    logger(err, 'ERROR')
                    res.status(SC.BAD_REQUEST).json({
                        error: 'Error updating current module'
                    })
                })
        } else if (moduleId === 'undefined') {
            await progressModel
                .findOneAndUpdate(
                    { userId, 'courses._id': id },
                    {
                        $set: {
                            'courses.$.courseStatus.completedStatus': true,
                            'courses.$.courseStatus.completedDate': new Date()
                        }
                    },
                    { new: true }
                )
                .then((data) => {
                    res.status(SC.OK).json({
                        message: 'Course completed successfully',
                        data: data
                    })
                })
        }
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Update Current Module Function is Executed')
    }
}

const updateCurrentChapter = async (req, res) => {
    const userId = req.auth._id
    const { chapterId, duration, id } = req.body
    try {
        await progressModel
            .findOneAndUpdate(
                { userId, 'courses._id': id },
                {
                    $set: {
                        'courses.$.currentChapter.chapterId': chapterId,
                        'courses.$.currentChapterTimestamp': duration,
                        'courses.$.currentChapter.currentSlide': 0
                    }
                },
                { new: true }
            )
            .then((data) => {
                res.status(SC.OK).json({
                    message: 'Updated current chapter successfully',
                    data: data
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                res.status(SC.BAD_REQUEST).json({
                    error: 'Error updating current chapter'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Update Current Chapter Function is Executed')
    }
}

const updateCurrentSlide = async (req, res) => {
    const userId = req.auth._id
    const { index, id } = req.body
    try {
        await progressModel
            .findOneAndUpdate(
                { userId, 'courses._id': id },
                {
                    $set: {
                        'courses.$.currentChapter.currentSlide': index
                    }
                },
                { new: true }
            )
            .then((data) => {
                res.status(SC.OK).json({
                    message: 'Updated current slide successfully',
                    data: data
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                res.status(SC.BAD_REQUEST).json({
                    error: 'Error updating current slide'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Update Current Slide Function is Executed')
    }
}

const updateCurrentTimestamp = async (req, res) => {
    const userId = req.auth._id
    const { time, id } = req.body
    try {
        await progressModel
            .updateOne(
                { userId, 'courses._id': id },
                {
                    $set: {
                        'courses.$.currentChapterTimestamp': time
                    }
                }
            )
            .then(() => {
                res.status(SC.OK).json({
                    message: 'Updated current timestamp successfully'
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                res.status(SC.BAD_REQUEST).json({
                    error: 'Error updating current timestamp'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Update Current Timestamp Function is Executed')
    }
}

const updateCompletedModule = async (req, res) => {
    const userId = req.auth._id
    const { moduleId, id } = req.body
    try {
        await progressModel
            .findOneAndUpdate(
                { userId, 'courses._id': id },
                {
                    $push: {
                        'courses.$.completedModules': { moduleId }
                    }
                },
                { new: true }
            )
            .then((data) => {
                res.status(SC.OK).json({
                    message: 'Updated completed module successfully',
                    data: data
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                res.status(SC.BAD_REQUEST).json({
                    error: 'Error updating completed module'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Update Completed Module Function is Executed')
    }
}

const updateCompletedChapter = async (req, res) => {
    const userId = req.auth._id
    const { chapterId, id } = req.body
    try {
        await progressModel
            .findOneAndUpdate(
                { userId, 'courses._id': id },
                {
                    $push: {
                        'courses.$.completedChapters': { chapterId }
                    }
                },
                { new: true }
            )
            .then((data) => {
                res.status(SC.OK).json({
                    message: 'Updated completed chapter successfully',
                    data: data
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                res.status(SC.BAD_REQUEST).json({
                    error: 'Error updating completed chapter'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Update Completed Chapter Function is Executed')
    }
}

const courseCompleted = async (req, res) => {
    const userId = req.auth._id
    const { status, id } = req.body

    try {
        await progressModel
            .findOneAndUpdate(
                { userId, 'courses._id': id },
                {
                    $set: {
                        'courses.$.courseStatus.completedStatus': status,
                        'courses.$.courseStatus.completedDate': status
                            ? new Date()
                            : null
                    }
                },
                { new: true }
            )
            .then((data) => {
                res.status(SC.OK).json({
                    message: 'Course completed successfully',
                    data: data
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Course Completed Function is Executed')
    }
}

module.exports = {
    getAllProgress,
    getProgress,
    updateCurrentModule,
    updateCurrentChapter,
    updateCurrentSlide,
    updateCurrentTimestamp,
    updateCompletedModule,
    updateCompletedChapter,
    courseCompleted
}
