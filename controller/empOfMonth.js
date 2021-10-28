/**
 * @author krish
 */

const eomModel = require('../model/empOfMonth')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const month = new Date().getMonth() + 1
const year = new Date().getFullYear()

const saveEOM = async (req, res) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    try {
        await eomModel
            .findOne({ month: month, year: year })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.BAD_REQUEST).json({
                        error: 'Employee of this month is already available on the database, Kindly delete it to create a new one'
                    })
                } else {
                    form.parse(req, (err, fields, file) => {
                        if (err) {
                            return res.status(SC.BAD_REQUEST).json({
                                error: 'Problem with EOM image!'
                            })
                        }

                        const eom = new eomModel(fields)
                        eom.month = month
                        eom.year = year

                        _.forIn(file, (value, key) => {
                            if (value.size > 3000000) {
                                return res.status(SC.BAD_REQUEST).json({
                                    error: 'File size is too big!'
                                })
                            }
                            eom[`${key}`].name = value.name
                            eom[`${key}`].data = fs.readFileSync(value.path)
                            eom[`${key}`].contentType = value.type
                        })

                        eom.save((err, data) => {
                            if (err) {
                                res.status(SC.BAD_REQUEST).json({
                                    error: 'Saving data in DB failed'
                                })
                            }
                            data.empImage = undefined
                            data.instructorSign = undefined
                            data.instructorImage = undefined
                            res.status(SC.OK).json({
                                message:
                                    'Employee of the month saved successfully!',
                                data: data
                            })
                        })
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Save EOM Function is Executed')
    }
}

const getEOM = async (req, res) => {
    try {
        await eomModel.findOne({ month }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                data.empImage = undefined
                data.instructorImage = undefined
                data.instructorSign = undefined

                res.status(SC.OK).json({
                    message: 'Employee of the month fetched successfully!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    message: 'No EOM document is found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get EOM By User Function is Executed')
    }
}

const getEOMById = async (req, res) => {
    try {
        await eomModel.findOne({ _id: req.params.id }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                data.empImage = undefined
                data.instructorImage = undefined
                data.instructorSign = undefined
                res.status(SC.OK).json({
                    message: 'Employee of the month fetched successfully!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    message: 'No EOM document is found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get EOM By Id Function is Executed')
    }
}

const getEOMByMonth = async (req, res) => {
    try {
        await eomModel
            .findOne({ month: req.params.month })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    data.empImage = undefined
                    data.instructorImage = undefined
                    data.instructorSign = undefined
                    res.status(SC.OK).json({
                        message: 'Employee of the month fetched successfully!',
                        data: data
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        message: 'No EOM document is found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get EOM By Month Function is Executed')
    }
}

const getAllEMOS = async (req, res) => {
    try {
        await eomModel
            .find({}, { empImage: 0, instructorImage: 0, instructorSign: 0 })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    data.forEach((data) => {
                        data.empImage = undefined
                        data.instructorImage = undefined
                        data.instructorSign = undefined
                    })
                    res.status(SC.OK).json({
                        message: 'Employee of the month fetched successfully!',
                        data: data
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        message: 'No EOM document is found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All EOMs Function is Executed')
    }
}

const getEOMPhoto = async (req, res) => {
    const url = req.params.id.split('-')
    const image = url[0]
    const id = url[1]
    try {
        await eomModel.findOne({ _id: id }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                res.set('Content-Type', data[`${image}`].contentType)
                return res.status(SC.OK).send(data[`${image}`].data)
            } else {
                res.status(SC.NOT_FOUND).json({
                    message: 'No EOM photo is found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get EOM Photo Function is Executed')
    }
}

const updateEOMById = async (req, res) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    try {
        await eomModel.findOne({ _id: req.params.id }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (!data) {
                res.status(SC.NOT_FOUND).json({
                    message: 'No EOM document to update!'
                })
            } else {
                form.parse(req, (err, fields, file) => {
                    if (err) {
                        logger(err, 'ERROR')

                        return res.status(SC.BAD_REQUEST).json({
                            error: 'Problem with EOM image!'
                        })
                    }
                    let {
                        empName,
                        empDesc,
                        skills,
                        description,
                        instructorName,
                        instructorRole,
                        month,
                        year,
                        title
                    } = fields

                    !empName ? (empName = data?.empName) : empName
                    !empDesc ? (empDesc = data?.empDesc) : empDesc
                    !skills ? (skills = data?.skills) : skills.split(',')
                    !description
                        ? (description = data?.description)
                        : description
                    !instructorName
                        ? (instructorName = data?.instructorName)
                        : instructorName
                    !instructorRole
                        ? (instructorRole = data?.instructorRole)
                        : instructorRole
                    !month ? (month = data?.month) : month
                    !year ? (year = data?.year) : year
                    !title ? (title = data?.title) : title

                    let empFileData,
                        empFileType,
                        empFileName,
                        instructorFileData,
                        instructorFileType,
                        instructorFileName,
                        instructorSignFileData,
                        instructorSignFileType,
                        instructorSignFileName
                    if (file.empImage) {
                        if (file.empImage.size > 3000000) {
                            return res.status(SC.BAD_REQUEST).json({
                                error: 'File size is too big!'
                            })
                        }
                        empFileData = fs.readFileSync(file.empImage.path)
                        empFileType = file.empImage.type
                        empFileName = file.empImage.name
                    } else {
                        empFileData = data.empImage.data
                        empFileType = data.empImage.contentType
                        empFileName = data.empImage.name
                    }

                    if (file.instructorImage) {
                        if (file.instructorImage.size > 3000000) {
                            return res.status(SC.BAD_REQUEST).json({
                                error: 'File size is too big!'
                            })
                        }
                        instructorFileData = fs.readFileSync(
                            file.instructorImage.path
                        )
                        instructorFileType = file.instructorImage.type
                        instructorFileName = file.instructorImage.name
                    } else {
                        instructorFileData = data.instructorImage.data
                        instructorFileType = data.instructorImage.contentType
                        instructorFileName = data.instructorImage.name
                    }

                    if (file.instructorSign) {
                        if (file.instructorSign.size > 3000000) {
                            return res.status(SC.BAD_REQUEST).json({
                                error: 'File size is too big!'
                            })
                        }
                        instructorSignFileData = fs.readFileSync(
                            file.instructorSign.path
                        )
                        instructorSignFileType = file.instructorSign.type
                        instructorSignFileName = file.instructorSign.name
                    } else {
                        instructorSignFileData = data.instructorSign.data
                        instructorSignFileType = data.instructorSign.contentType
                        instructorSignFileName = data.instructorSign.name
                    }

                    eomModel
                        .updateOne(
                            { _id: req.params.id },
                            {
                                $set: {
                                    empName: empName,
                                    empDesc: empDesc,
                                    skills: skills,
                                    title: title,
                                    description: description,
                                    instructorName: instructorName,
                                    instructorRole: instructorRole,
                                    month: month,
                                    year: year,
                                    empImage: {
                                        data: empFileData,
                                        contentType: empFileType,
                                        name: empFileName
                                    },
                                    instructorImage: {
                                        data: instructorFileData,
                                        contentType: instructorFileType,
                                        name: instructorFileName
                                    },
                                    instructorSign: {
                                        data: instructorSignFileData,
                                        contentType: instructorSignFileType,
                                        name: instructorSignFileName
                                    }
                                }
                            }
                        )
                        .then(() => {
                            res.status(SC.OK).json({
                                message: 'EOM document updated successfully!'
                            })
                        })
                        .catch(() => {
                            res.status(SC.BAD_REQUEST).json({
                                error: 'EOM document updation Failed!'
                            })
                        })
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Update EOM Function is Executed')
    }
}

const deleteEOMById = async (req, res) => {
    try {
        await eomModel
            .findByIdAndDelete({ _id: req.params.id })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data.deletedCount) {
                    res.status(SC.OK).json({
                        message: 'EOM document deleted successfully!'
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        message: 'No EOM document found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete EOM Function is Executed')
    }
}

module.exports = {
    saveEOM,
    getEOM,
    getEOMById,
    getEOMByMonth,
    getEOMPhoto,
    getAllEMOS,
    updateEOMById,
    deleteEOMById
}
