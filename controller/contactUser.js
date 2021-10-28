/**
 * @author krish
 */

const contactModel = require('../model/contactUser')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const saveUserContact = async (req, res) => {
    const { name, phoneNumber, message } = req.body
    const result = { name, phoneNumber, message }
    const contactUser = new contactModel(result)

    try {
        await contactUser.save((err, data) => {
            if (err) {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Saving data in DB failed'
                })
            }
            res.status(SC.OK).json({
                message: 'Contact user saved successfully!',
                data: data
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Save Contact User Function is Executed')
    }
}

const getUserContact = async (req, res) => {
    try {
        await contactModel.findOne({ _id: req.params.id }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                res.status(SC.OK).json({
                    message: 'Contact user fetched successfully!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No contact user found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get User Contact Function is Executed')
    }
}
const getAllUserContacts = async (req, res) => {
    try {
        await contactModel.find({}).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                res.status(SC.OK).json({
                    message: 'All contact user fetched successfully!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No contact user found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All User Contacts Function is Executed')
    }
}

const deleteUserContactById = async (req, res) => {
    try {
        await contactModel
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
                        error: 'No contact user found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete Contact User Function is Executed')
    }
}

module.exports = {
    saveUserContact,
    getUserContact,
    getAllUserContacts,
    deleteUserContactById
}
