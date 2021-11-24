/**
 * @author krish
 */

const requirementsModel = require('../model/requirements')
const formidable = require('formidable')
const fs = require('fs')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const createRequirement = async (req, res) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    try {
        await form.parse(req, (err, fields, file) => {
            if (err) {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Problem with the image'
                })
            }
            const { title, price, description } = fields

            if (!title || !price || !description) {
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Please include all fields'
                })
            }

            const requirements = new requirementsModel(fields)

            if (file.photo) {
                if (file.photo.size > 3000000) {
                    return res.status(SC.BAD_REQUEST).json({
                        error: 'File size too big!'
                    })
                }
                requirements.photo.data = fs.readFileSync(file.photo.path)
                requirements.photo.contentType = file.photo.type
            }
            requirements.save((err, data) => {
                if (err) {
                    res.status(SC.BAD_REQUEST).json({
                        error: 'Saving requirement in DB failed'
                    })
                }
                data.photo = undefined
                res.status(SC.OK).json({
                    message: 'Requirement saved successfully!',
                    data: data
                })
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Save Requirements Function is Executed')
    }
}

const updateRequirement = async (req, res) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    try {
        await requirementsModel
            .findOne({ _id: req.params.requirementId })
            .exec((err, data) => {
                console.log(data)
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    form.parse(req, (err, fields, file) => {
                        if (err) {
                            logger(err, 'ERROR')
                            return res.status(SC.BAD_REQUEST).json({
                                error: 'Problem with the image'
                            })
                        }
                        let { title, price, description } = fields

                        !title ? (title = data.title) : title
                        !description
                            ? (description = data.description)
                            : description
                        !price ? (price = data.price) : price

                        let requirementData, type
                        if (file.photo) {
                            if (file.photo.size > 3000000) {
                                return res.status(SC.BAD_REQUEST).json({
                                    error: 'File size too big!'
                                })
                            }
                            requirementData = fs.readFileSync(file.photo.path)
                            type = file.photo.type
                        } else {
                            requirementData = data.photo.data
                            type = data.photo.contentType
                        }

                        requirementsModel
                            .updateOne(
                                { _id: req.params.requirementId },
                                {
                                    $set: {
                                        title: title,
                                        price: price,
                                        description: description,
                                        photo: {
                                            data: requirementData,
                                            contentType: type
                                        }
                                    }
                                }
                            )
                            .then(() => {
                                res.status(SC.OK).json({
                                    message: 'Requirement updated successfully!'
                                })
                            })
                            .catch((err) => {
                                logger(err, 'ERROR')
                                res.status(SC.BAD_REQUEST).json({
                                    error: 'Requirement updation failed!'
                                })
                            })
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No Requirements found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Update Requirements Function is Executed')
    }
}

const getRequirementById = async (req, res) => {
    try {
        await requirementsModel
            .findOne({ _id: req.params.requirementId })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    data.photo = undefined
                    res.status(SC.OK).json({
                        message: 'Requirement fetched successfully!',
                        data: data
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No Requirements found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Requirement Function is Executed')
    }
}

const getAllRequirements = async (req, res) => {
    try {
        await requirementsModel.find({}, { photo: 0 }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                data?.forEach((ele) => (ele.photo = undefined))
                res.status(SC.OK).json({
                    message: 'Requirements fetched successfully!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No Requirement found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All Requirements Function is Executed')
    }
}

const getRequirementPhoto = async (req, res) => {
    try {
        await requirementsModel
            .findOne({ _id: req.params.requirementId })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    if (data?.photo.data !== null) {
                        res.set('Content-Type', data?.photo.contentType)
                        res.status(SC.OK).send(data?.photo.data)
                    } else {
                        res.status(SC.NOT_FOUND).json({
                            error: 'Requirement photo not found!'
                        })
                    }
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No requirement found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Rquirement File Function is Executed!')
    }
}

const deleteRequirementById = async (req, res) => {
    try {
        await requirementsModel
            .findByIdAndDelete({ _id: req.params.requirementId })
            .exec((err, data) => {
                if (err) {
                    res.status(SC.BAD_REQUEST).json({
                        error: 'Deleting requirement from DB is failed!'
                    })
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'Requirement deleted successfully!'
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No requirements found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete Requirement Function is Executed!')
    }
}

module.exports = {
    createRequirement,
    updateRequirement,
    getRequirementById,
    getAllRequirements,
    getRequirementPhoto,
    deleteRequirementById
}
