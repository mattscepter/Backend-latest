/**
 * @author krish
 */

const docModel = require('../model/docs')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const getObjSize = (obj) => {
    let size = 0,
        key
    for (key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key)) size++
    }
    return size
}

const uploadDocs = async (req, res) => {
    const userId = req.auth._id
    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    try {
        await form.parse(req, (err, fields, file) => {
            if (err) {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Problem with document'
                })
            }
            docModel.findOne({ userId }).exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.BAD_REQUEST).json({
                        error: 'Document is already available for this user!'
                    })
                } else {
                    if (getObjSize(file)) {
                        let savedDoc = 0
                        const docs = new docModel()
                        docs.userId = userId
                        _.forIn(file, (value, key) => {
                            if (value.size > 3000000) {
                                logger(`File size is too big for ${value.name}`)
                            } else {
                                savedDoc++
                                docs[key].name = value.name
                                docs[key].data = fs.readFileSync(value.path)
                                docs[key].contentType = value.type
                            }
                        })
                        docs.save((err) => {
                            if (err) {
                                logger(err, 'ERROR')
                                return res.status(SC.BAD_REQUEST).json({
                                    error: 'Saving data in DB failed!'
                                })
                            }
                            res.status(SC.OK).json({
                                message: `${savedDoc} Document saved successfully!`
                            })
                        })
                    } else {
                        res.status(SC.NOT_FOUND).json({
                            error: 'Document not found!'
                        })
                    }
                }
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Upload Docs Function is Executed')
    }
}

const updateDocs = async (req, res) => {
    const userId = req.auth._id
    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    try {
        await form.parse(req, (err, fields, file) => {
            if (err) {
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Problem with the document!'
                })
            }
            docModel.findOne({ userId }).exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    let fileName, fileData, fileType
                    if (getObjSize(file)) {
                        let savedDoc = 0
                        _.forIn(file, (value, key) => {
                            if (value.size > 3000000) {
                                logger(`File size is too big for ${value.name}`)
                            } else {
                                fileName = value.name
                                fileData = fs.readFileSync(value.path)
                                fileType = value.type
                                savedDoc++
                                docModel
                                    .updateOne(
                                        { userId },
                                        {
                                            $set: {
                                                [key]: {
                                                    ...data[key],
                                                    name: fileName,
                                                    data: fileData,
                                                    contentType: fileType,
                                                    updatedAt:
                                                        new Date().toISOString()
                                                }
                                            }
                                        }
                                    )
                                    .then(() => null)
                            }
                        })
                        res.status(SC.OK).json({
                            message: `${savedDoc} documents updated succesfully!`
                        })
                    } else {
                        res.status(SC.NOT_FOUND).json({
                            error: 'Document not found!'
                        })
                    }
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No documents found for this user!'
                    })
                }
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Update Docs Function is Executed!')
    }
}

const approveDocs = async (req, res) => {
    const userId = req.params.userId

    const dataArr = req.body.data
    try {
        await docModel.findOne({ userId }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                if (dataArr?.length) {
                    dataArr?.forEach((val) => {
                        docModel
                            .updateOne(
                                { userId },
                                {
                                    $set: {
                                        [val.docName]: {
                                            ...data[val.docName],
                                            isApproved: val.isApproved,
                                            note: val.note,
                                            updatedAt: new Date().toISOString()
                                        }
                                    }
                                }
                            )
                            .then(() => null)
                    })
                    res.status(SC.OK).json({
                        message: `${dataArr?.length} documents updated succesfully!`
                    })
                } else {
                    res.status(SC.WRONG_ENTITY).json({
                        error: 'Approve docs array is undefined!'
                    })
                }
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No document found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Approve Docs Function is Executed!')
    }
}

const getDocById = async (req, res) => {
    try {
        await docModel.findOne({ _id: req.params.id }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                _.forIn(data, (value, key) => {
                    if (
                        data[`${key}`] !== '_id' &&
                        'userId' &&
                        'createdAt' &&
                        'updatedAt' &&
                        '__v'
                    ) {
                        data[`${key}`]?.data
                            ? (data[`${key}`].data = undefined)
                            : null
                    }
                })
                res.status(SC.OK).json({
                    message: 'Doc Fetched successfully from DB!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    message: 'No Docs found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Doc Function is Executed')
    }
}

const getUserDocs = async (req, res) => {
    const userId = req.auth._id
    try {
        await docModel.findOne({ userId }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                _.forIn(data, (value, key) => {
                    if (
                        data[`${key}`] !== '_id' &&
                        'userId' &&
                        'createdAt' &&
                        'updatedAt' &&
                        '__v'
                    ) {
                        data[`${key}`]?.data
                            ? (data[`${key}`].data = undefined)
                            : null
                    }
                })
                res.status(SC.OK).json({
                    message: 'User document details fetched successfully!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No document found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get User Docs Function is Executed!')
    }
}

const getAllUserDocs = async (req, res) => {
    //label for pagination
    const label = {
        totalDocs: 'totalDocs',
        docs: 'docs',
        limit: 'perPage',
        page: 'currentPageNo',
        nextPage: 'nextPageNo',
        prevPage: 'prevPageNo',
        totalPages: 'pageCount'
    }
    let options = {
        page: 1,
        limit: 10,
        customLabels: label
    }
    req.query.page !== undefined ? (options.page = req.query.page) : null
    req.query.limit !== undefined ? (options.limit = req.query.limit) : null
    try {
        await docModel.paginate({}, options, (err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                console.log(data)
                data?.docs?.forEach((val, index) => {
                    _.forIn(val, (value, key) => {
                        if (
                            data.docs[`${index}`][`${key}`] !== '_id' &&
                            'userId' &&
                            'createdAt' &&
                            'updatedAt' &&
                            '__v'
                        ) {
                            data.docs[`${index}`][`${key}`]?.data ||
                            data.docs[`${index}`][`${key}`]?.data === null
                                ? (data.docs[`${index}`][`${key}`].data =
                                      undefined)
                                : null

                            data.docs[`${index}`][`${key}`]?.name === null
                                ? (data.docs[`${index}`][`${key}`].name =
                                      undefined)
                                : null

                            data.docs[`${index}`][`${key}`]?.contentType ===
                            null
                                ? (data.docs[`${index}`][`${key}`].contentType =
                                      undefined)
                                : null
                        }
                    })
                })
                res.status(SC.OK).json({
                    message: 'User document details fetched successfully!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No document found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All User Docs Function is Executed!')
    }
}

const getDocFile = async (req, res) => {
    const userId = req.auth._id
    const doc = req.params.id
    try {
        await docModel.findOne({ userId }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                if (data[`${doc}`].data !== null) {
                    res.set('Content-Type', data[`${doc}`].contentType)
                    res.status(SC.OK).send(data[`${doc}`].data)
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'Doc Not Found!'
                    })
                }
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No document found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Doc File Function is Executed!')
    }
}

const deleteDocById = async (req, res) => {
    try {
        await docModel
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
                        error: 'No document found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete Document Function is Executed!')
    }
}

const deleteDocs = async (req, res) => {
    const userId = req.auth._id
    const docs = req.body.docs

    if (docs?.length) {
        try {
            await docModel.findOne({ userId }).exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data.deletedCount) {
                    docs.forEach((key) => {
                        docModel
                            .updateOne(
                                { userId },
                                {
                                    $set: {
                                        [key]: {
                                            name: null,
                                            data: null,
                                            contentType: null
                                        }
                                    }
                                }
                            )
                            .then(() => null)
                    })
                    res.status(SC.OK).json({
                        message: `${docs.length} document deleted succesfully!`
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No Document found!'
                    })
                }
            })
        } catch (err) {
            logger(err, 'ERROR')
        } finally {
            logger('Delete Docs Function is Executed!')
        }
    } else {
        res.status(SC.BAD_REQUEST).json({
            error: 'Give atleast 1 doc in an array with docs as a key!'
        })
    }
}

module.exports = {
    uploadDocs,
    updateDocs,
    approveDocs,
    getDocById,
    getUserDocs,
    getAllUserDocs,
    getDocFile,
    deleteDocById,
    deleteDocs
}
