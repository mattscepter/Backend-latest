/**
 * @author krish
 */

const clientModel = require('../model/client')
const formidable = require('formidable')
const fs = require('fs')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const saveClient = async (req, res) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    try {
        await form.parse(req, (err, fields, file) => {
            if (err) {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Problem with an Image!'
                })
            }
            const { name } = fields
            if (!name) {
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Please include name!'
                })
            }

            const client = new clientModel(fields)
            if (file.logo) {
                if (file.logo.size > 3000000) {
                    return res.status(SC.BAD_REQUEST).json({
                        error: 'File size is too big!'
                    })
                }
                client.logo.data = fs.readFileSync(file.logo.path)
                client.logo.contentType = file.logo.type
            }

            client.save((err, data) => {
                if (err) {
                    res.status(SC.BAD_REQUEST).json({
                        error: 'Saving data in DB failed!'
                    })
                }
                data.logo = undefined
                res.status(SC.OK).json({
                    message: 'Client saved successfully on DB!',
                    data: data
                })
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Save Client Function is Executed')
    }
}

const getClientById = async (req, res) => {
    try {
        await clientModel.findOne({ _id: req.params.id }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                data.logo = undefined
                res.status(SC.OK).json({
                    message: 'Client fetched successfully!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    message: 'No client found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Client Function is Executed')
    }
}

const getAllClient = async (req, res) => {
    try {
        await clientModel.find({}).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                data?.forEach((ele) => (ele.logo = undefined))
                res.status(SC.OK).json({
                    message: 'Clients fetched successfully!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    message: 'No client found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All Client Function is Executed')
    }
}

const getClientPhoto = async (req, res) => {
    const id = req.params.id
    try {
        await clientModel.findOne({ _id: id }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                res.set('Content-Type', data.logo.contentType)
                return res.status(SC.OK).send(data.logo.data)
            } else {
                res.status(SC.NOT_FOUND).json({
                    message: 'No client photo found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Client Photo Function is Executed')
    }
}

const updateClientById = async (req, res) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    try {
        await clientModel.findOne({ _id: req.params.id }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            form.parse(req, (err, fields, file) => {
                if (err) {
                    logger(err, 'ERROR')
                    return res.status(SC.BAD_REQUEST).json({
                        error: 'Problem with an image!'
                    })
                }
                let { name, url } = fields

                !name ? (name = data.name) : name
                !url ? (url = data.url) : url

                let clientData, type
                if (file.logo) {
                    if (file.logo.size > 3000000) {
                        return res.status(SC.BAD_REQUEST).json({
                            error: 'File size too big!'
                        })
                    }
                    clientData = fs.readFileSync(file.logo.path)
                    type = file.logo.type
                } else {
                    clientData = data.logo.data
                    type = data.logo.contentType
                }

                clientModel
                    .updateOne(
                        { _id: req.params.id },
                        {
                            $set: {
                                name: name,
                                url: url,
                                logo: {
                                    data: clientData,
                                    contentType: type
                                }
                            }
                        }
                    )
                    .then(() => {
                        res.status(SC.OK).json({
                            message: 'Client updated successfully!'
                        })
                    })
                    .catch(() => {
                        res.status(SC.BAD_REQUEST).json({
                            error: 'Client Updation Failed!'
                        })
                    })
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Update Client Function is Executed')
    }
}

const deleteClientById = async (req, res) => {
    try {
        await clientModel
            .findByIdAndDelete({ _id: req.params.id })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data.deletedCount) {
                    res.status(SC.OK).json({
                        message: 'Client Document deleted successfully!'
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        message: 'No client found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete Client Function is Executed')
    }
}

module.exports = {
    saveClient,
    getClientById,
    getAllClient,
    getClientPhoto,
    updateClientById,
    deleteClientById
}
