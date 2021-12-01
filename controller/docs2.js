/**
 * @author utkarsh
 */

const userModel = require('../model/user.js')
const doc2Model = require('../model/doc2')
const formidable = require('formidable')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')
const fs = require('fs')

const createDoc = async (req, res) => {
    const userId = req.auth._id
    const form = new formidable.IncomingForm()

    form.keepExtensions = true
    try {
        form.parse(req, (err, fields, file) => {
            console.log(err)
            doc2Model
                .findOne({ userId, name: fields.name })
                .exec((err, data) => {
                    if (err) {
                        logger(err, 'ERROR')
                    }
                    if (data) {
                        res.status(SC.BAD_REQUEST).json({
                            error: 'Document is already available for this user!'
                        })
                    } else {
                        userModel.findOne({ _id: userId }).then((response) => {
                            const docs = new doc2Model()
                            docs.username =
                                response?.name +
                                ' ' +
                                (response.lastname ? response.lastname : '')
                            docs.userId = userId
                            docs.userDocId = response?.docId
                            docs.name = fields.name
                            if (file.image) {
                                if (file.image.size > 3145728) {
                                    return res.status(400).json({
                                        error: 'File size too big!'
                                    })
                                }
                                docs.data = fs.readFileSync(file.image.path)
                                docs.contentType = file.image.type
                            }
                            docs.save((err) => {
                                if (err) {
                                    logger(err, 'ERROR')
                                    return res.status(SC.BAD_REQUEST).json({
                                        error: 'Saving data in DB failed!'
                                    })
                                }
                                res.status(SC.OK).json({
                                    message: `Document saved successfully!`
                                })
                            })
                        })
                    }
                })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Upload Docs Function is Executed')
    }
}

const reuploadDoc = async (req, res) => {
    const userId = req.auth._id
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
                let fileData = fs.readFileSync(file.image.path)
                let fileType = file.image.type
                doc2Model
                    .updateOne(
                        { userId, name: fields.name },
                        {
                            data: fileData,
                            contentType: fileType,
                            isApproved: null,
                            note: ''
                        }
                    )
                    .then(() => {
                        return res.status(SC.OK).json({
                            message: `Documents updated succesfully!`
                        })
                    })
                    .catch((err) => {
                        logger(err, 'ERROR')
                        return res.status(SC.NOT_FOUND).json({
                            error: 'Error updating document'
                        })
                    })
            } else {
                console.log('hi')
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('ReUpload Docs Function is Executed')
    }
}

const getUsersDoc = async (req, res) => {
    const userId = req.auth._id
    try {
        await doc2Model
            .find({ userId }, { data: 0, contentType: 0 })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'Doc Fetched successfully from DB!',
                        data: data
                    })
                }
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Get User Docs Function is Executed')
    }
}

const getUsersDocAdmin = async (req, res) => {
    const userId = req.params.id
    try {
        await doc2Model
            .find({ userId }, { data: 0, contentType: 0 })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'Doc Fetched successfully from DB!',
                        data: data
                    })
                }
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Get Users Docs Admin Function is Executed')
    }
}

const getAllDocs = async (req, res) => {
    try {
        await doc2Model
            .find({}, { data: 0, contentType: 0 })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'Doc Fetched successfully from DB!',
                        data: data
                    })
                }
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Get All Docs Function is Executed')
    }
}

const approveDoc = async (req, res) => {
    const _id = req.params.id
    const { note, isApproved } = req.body
    try {
        await doc2Model
            .updateOne({ _id }, { isApproved, note })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'Doc approved successfully'
                    })
                }
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Approve Docs Function is Executed')
    }
}

const getDoc = async (req, res) => {
    const id = req.params.id
    try {
        await doc2Model.findOne({ _id: id }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                res.status(SC.OK).json({
                    message: 'Doc Fetched successfully from DB!',
                    data: data
                })
            }
        })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Get Single Doc Function is Executed')
    }
}

module.exports = {
    createDoc,
    reuploadDoc,
    getUsersDoc,
    getUsersDocAdmin,
    getAllDocs,
    approveDoc,
    getDoc
}
