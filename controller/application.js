/**
 * @author krish
 */

const applicationModel = require('../model/application')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const createApplication = async (req, res) => {
    const {
        name,
        email,
        elegibleToWorkInCanada,
        eligibilityType,
        validSecurityGuardLicence,
        licenceNo,
        canDrive,
        highestLevelOfEducation,
        educationInCanada,
        priorExperience,
        yearsOfExp
    } = req.body

    try {
        const application = new applicationModel({
            name,
            email,
            elegibleToWorkInCanada,
            eligibilityType,
            validSecurityGuardLicence,
            licenceNo,
            canDrive,
            highestLevelOfEducation,
            educationInCanada,
            priorExperience,
            yearsOfExp
        })

        application.save((err, data) => {
            if (err) {
                logger(err, 'ERROR')
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Creating application in DB is failed!'
                })
            }
            res.status(SC.OK).json({
                message: 'Application created successfully!',
                data: data
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Create Application Function is Executed!')
    }
}

const updateApplication = async (req, res) => {
    let result = req.body
    try {
        await applicationModel
            .updateOne(
                { _id: req.params.applicationId },
                {
                    $set: result
                }
            )
            .then(() => {
                res.status(SC.OK).json({
                    message: 'Application Updated Successfully!'
                })
            })
            .catch((err) => {
                res.status(SC.INTERNAL_SERVER_ERROR).json({
                    error: 'Application Updation Failed!'
                })
                logger(err, 'ERROR')
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Update Application Function is Executed!')
    }
}

const getApplicationById = async (req, res) => {
    try {
        await applicationModel
            .findOne({ _id: req.params.applicationId })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'Application fetched successfully!',
                        data: data
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No applications found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Application Function is Executed')
    }
}

const getAllApplications = async (req, res) => {
    //label for pagination
    const label = {
        totalDocs: 'totalApplications',
        docs: 'applications',
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
        await applicationModel.paginate({}, options, (err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                res.status(SC.OK).json({
                    message: 'Applications fetched successfully!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No Applications found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All Applications Function is Executed')
    }
}

const deleteApplicationById = async (req, res) => {
    try {
        await applicationModel
            .findByIdAndDelete({ _id: req.params.applicationId })
            .exec((err, data) => {
                if (err) {
                    res.status(SC.BAD_REQUEST).json({
                        error: 'Deleting application from DB is failed!'
                    })
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'Application deleted successfully!'
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No applications found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete Application Function is Executed!')
    }
}

const deleteAllApplications = async (req, res) => {
    try {
        await applicationModel.deleteMany({}).exec((err, data) => {
            if (err) {
                res.status(SC.BAD_REQUEST).json({
                    error: 'Deleting application from DB is failed!'
                })
                logger(err, 'ERROR')
            }
            if (data) {
                res.status(SC.OK).json({
                    message: 'All Applications deleted successfully!'
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No applications found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete All Application Function is Executed!')
    }
}

module.exports = {
    createApplication,
    updateApplication,
    getApplicationById,
    getAllApplications,
    deleteApplicationById,
    deleteAllApplications
}
