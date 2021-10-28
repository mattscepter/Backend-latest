/**
 * @author krish
 */

const contactModel = require('../model/contact')
const { validationResult } = require('express-validator')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const updateContact = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(SC.WRONG_ENTITY).json({
            error: errors.array()[0].msg
        })
    }

    const defaultData = {
        phoneNumber: '647.289.1070',
        address: `350 Rutherford Road South 
        Brampton ON L6W-4N6 
        Suite 210 Plaza 2`,
        email: 'info@argussecurityservices.ca',
        mapLocation:
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2885.38568994079!2d-79.71944568499285!3d43.681744458603305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b3f742bd5dfaf%3A0x4e85dd4aa00d79f1!2sArgus%20Security%20Services%20Corp.!5e0!3m2!1sen!2sin!4v1628009453160!5m2!1sen!2sin'
    }

    try {
        await contactModel.findOne({}).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                const id = data._id

                let phoneNumber = req.body.phoneNumber,
                    email = req.body.email,
                    address = req.body.address,
                    mapLocation = req.body.mapLocation

                req.body.phoneNumber === undefined
                    ? (phoneNumber = defaultData.phoneNumber)
                    : null

                req.body.email === undefined
                    ? (email = defaultData.email)
                    : null

                req.body.address === undefined
                    ? (address = defaultData.address)
                    : null

                req.body.mapLocation === undefined
                    ? (mapLocation = defaultData.mapLocation)
                    : null

                contactModel
                    .updateOne(
                        { _id: id },
                        {
                            $set: {
                                phoneNumber,
                                email,
                                address,
                                mapLocation
                            }
                        }
                    )
                    .then(() => {
                        res.status(SC.OK).json({
                            message: 'Contact updated successfully!',
                            data: {
                                phoneNumber,
                                email,
                                address,
                                mapLocation
                            }
                        })
                    })
                    .catch(() => {
                        res.status(SC.BAD_REQUEST).json({
                            error: 'Contact updation failed!'
                        })
                    })
            } else {
                const contact = new contactModel(defaultData)
                contact.save((err, data) => {
                    if (err) {
                        res.status(SC.BAD_REQUEST).json({
                            error: 'Saving data in DB failed!'
                        })
                    }
                    res.status(SC.OK).json({
                        message: 'Contact saved successfully!',
                        data: data
                    })
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Save Contact Function is Executed')
    }
}

const getContact = async (req, res) => {
    try {
        await contactModel.findOne({}).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                res.status(SC.OK).json({
                    message: 'Contact fetched successfully!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No contact found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Contact Function is Executed')
    }
}

module.exports = {
    getContact,
    updateContact
}
