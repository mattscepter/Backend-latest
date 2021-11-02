/**
 * @author krish
 */

const bucketModel = require('../model/bucket')
const userModel = require('../model/user')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const createBucket = async (req, res) => {
    let result = {
        bucketName: '',
        noOfStudents: 0,
        students: [],
        createdBy: {
            userId: '',
            userName: ''
        }
    }

    const userId = req.auth._id
    const { bucketName, students } = req.body
    try {
        await userModel.findOne({ _id: userId }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                result.bucketName = bucketName
                result.students = students
                result.noOfStudents = students?.length
                result.createdBy = {
                    userId: userId,
                    userName: data?.name
                }

                const bucket = new bucketModel(result)
                bucket.save((err, data) => {
                    if (err) {
                        logger(err, 'ERROR')
                        return res.status(SC.BAD_REQUEST).json({
                            error: 'Creating Bucket in DB is failed!'
                        })
                    }
                    res.status(SC.OK).json({
                        message: 'Bucket created successfully!',
                        data: data
                    })
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No User found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Create Bucket Function is Executed!')
    }
}

const updateBucket = async (req, res) => {
    const { bucketName, students } = req.body
    try {
        await bucketModel
            .findOne({ _id: req.params.bucketId })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    bucketModel
                        .updateOne(
                            { _id: req.params.bucketId },
                            {
                                $set: {
                                    bucketName: bucketName
                                        ? bucketName
                                        : data.bucketName,
                                    students: students
                                        ? students
                                        : data.students,
                                    noOfStudents: students
                                        ? students.length
                                        : data.students.length
                                }
                            }
                        )
                        .then(() => {
                            res.status(SC.OK).json({
                                message: 'Bucket updated successfully!'
                            })
                        })
                        .catch((err) => {
                            res.status(SC.BAD_REQUEST).json({
                                error: 'Bucket updation failed!'
                            })
                            logger(err, 'ERROR')
                        })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No Buckets found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Update Bucket Function is Executed!')
    }
}

const updateBucketStatus = async (req, res) => {
    const { status } = req.body
    try {
        await bucketModel
            .findOne({ _id: req.params.bucketId })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    bucketModel
                        .updateOne(
                            { _id: req.params.bucketId },
                            {
                                $set: {
                                    status: status
                                }
                            }
                        )
                        .then(() => {
                            res.status(SC.OK).json({
                                message: 'Bucket Status updated successfully!'
                            })
                        })
                        .catch((err) => {
                            res.status(SC.BAD_REQUEST).json({
                                error: 'Bucket Status updation failed!'
                            })
                            logger(err, 'ERROR')
                        })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No Buckets found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Update Bucket Status Function is Executed!')
    }
}

const getBucketById = async (req, res) => {
    try {
        await bucketModel
            .findOne({ _id: req.params.bucketId })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'Bucket fetched successfully!',
                        data: data
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No Buckets found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Bucket Function is Executed')
    }
}

const getAllBuckets = async (req, res) => {
    try {
        await bucketModel.find({}).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                res.status(SC.OK).json({
                    message: 'Buckets fetched successfully!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No Buckets found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All Buckets Function is Executed')
    }
}

const deleteBucketById = async (req, res) => {
    try {
        await bucketModel
            .findByIdAndDelete({ _id: req.params.bucketId })
            .exec((err, data) => {
                if (err) {
                    res.status(SC.BAD_REQUEST).json({
                        error: 'Deleting bucket from DB is failed!'
                    })
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'Bucket deleted successfully!'
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No buckets found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete Bucket Function is Executed!')
    }
}

module.exports = {
    createBucket,
    updateBucket,
    updateBucketStatus,
    getBucketById,
    getAllBuckets,
    deleteBucketById
}
