/**
 * @author krish
 */

const testimonialModel = require('../model/testimonial')
const formidable = require('formidable')
const fs = require('fs')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const saveTestimonial = async (req, res) => {
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
            const { name, role, description } = fields

            if (!name || !role || !description) {
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Please include all fields'
                })
            }

            const testimonial = new testimonialModel(fields)

            if (file.photo) {
                if (file.photo.size > 3000000) {
                    return res.status(SC.BAD_REQUEST).json({
                        error: 'File size too big!'
                    })
                }
                testimonial.photo.data = fs.readFileSync(file.photo.path)
                testimonial.photo.contentType = file.photo.type
            }
            testimonial.save((err, data) => {
                if (err) {
                    res.status(SC.BAD_REQUEST).json({
                        error: 'Saving data in DB failed'
                    })
                }
                data.photo = undefined
                res.status(SC.OK).json({
                    message: 'Testimonial saved successfully!',
                    data: data
                })
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Save Testimonial Function is Executed')
    }
}

const getTestimonialById = async (req, res) => {
    try {
        await testimonialModel
            .findOne({ _id: req.params.id })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    data.photo = undefined
                    res.status(SC.OK).json({
                        message: 'Testimonial fetched successfully!',
                        data: data
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No testimonial found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Testimonial Function is Executed')
    }
}

const getAllTestimonials = async (req, res) => {
    try {
        await testimonialModel.find({}, { photo: 0 }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                data?.forEach((ele) => (ele.photo = undefined))
                res.status(SC.OK).json({
                    message: 'Testimonials fetched successfully!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No testimonial found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All Testimonials Function is Executed')
    }
}

const getTestimonialPhoto = async (req, res) => {
    const id = req.params.id
    try {
        await testimonialModel.findOne({ _id: id }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                res.set('Content-Type', data.photo.contentType)
                return res.status(SC.OK).send(data.photo.data)
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No testimonial photo found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Testimonial Photo Function is Executed')
    }
}

const updateTestimonialById = async (req, res) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    try {
        await testimonialModel
            .findOne({ _id: req.params.id })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                form.parse(req, (err, fields, file) => {
                    if (err) {
                        logger(err, 'ERROR')
                        return res.status(SC.BAD_REQUEST).json({
                            error: 'Problem with the image'
                        })
                    }
                    let { name, role, description, isApproved, priority } =
                        fields

                    !name ? (name = data.name) : name
                    !role ? (role = data.role) : role
                    !description
                        ? (description = data.description)
                        : description
                    !isApproved ? (isApproved = data.isApproved) : isApproved
                    !priority ? (priority = data.priority) : priority

                    let empData, type
                    if (file.photo) {
                        if (file.photo.size > 3000000) {
                            return res.status(SC.BAD_REQUEST).json({
                                error: 'File size too big!'
                            })
                        }
                        empData = fs.readFileSync(file.photo.path)
                        type = file.photo.type
                    } else {
                        empData = data.photo.data
                        type = data.photo.contentType
                    }

                    testimonialModel
                        .updateOne(
                            { _id: req.params.id },
                            {
                                $set: {
                                    name: name,
                                    role: role,
                                    description: description,
                                    photo: {
                                        data: empData,
                                        contentType: type
                                    },
                                    isApproved: isApproved,
                                    priority: priority
                                }
                            }
                        )
                        .then(() => {
                            res.status(SC.OK).json({
                                message: 'User updated successfully!'
                            })
                        })
                        .catch((err) => {
                            logger(err, 'ERROR')
                            res.status(SC.BAD_REQUEST).json({
                                error: 'User updation failed!'
                            })
                        })
                })
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete Testimonial Function is Executed')
    }
}

const deleteTestimonialById = async (req, res) => {
    try {
        await testimonialModel
            .findByIdAndDelete({ _id: req.params.id })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data.deletedCount) {
                    res.status(SC.OK).json({
                        message: 'Document deleted successfully!'
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No testimonial found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete Testimonial Function is Executed')
    }
}

module.exports = {
    saveTestimonial,
    getTestimonialById,
    getAllTestimonials,
    getTestimonialPhoto,
    updateTestimonialById,
    deleteTestimonialById
}
