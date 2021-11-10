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
    const { chapterId, moduleId, id } = req.body
    try {
        await progressModel
            .updateOne(
                { userId, 'courses._id': id },
                {
                    $set: {
                        'courses.$.moduleId': moduleId,
                        'courses.$.chapterId': chapterId,
                        'courses.$.currentChapterTimestamp': 0
                    }
                }
            )
            .then(() => {
                res.status(SC.OK).json({
                    message: 'Updated current module successfully'
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                res.status(SC.BAD_REQUEST).json({
                    error: 'Error updating current module'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Update Current Module Function is Executed')
    }
}

const updateCurrentChapter = async (req, res) => {
    const userId = req.auth._id
    const { chapterId, id } = req.body
    try {
        await progressModel
            .updateOne(
                { userId, 'courses._id': id },
                {
                    $set: {
                        'courses.$.chapterId': chapterId,
                        'courses.$.currentChapterTimestamp': 0
                    }
                }
            )
            .then(() => {
                res.status(SC.OK).json({
                    message: 'Updated current chapter successfully'
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

module.exports = {
    getAllProgress,
    getProgress,
    updateCurrentModule,
    updateCurrentChapter,
    updateCurrentTimestamp
}
