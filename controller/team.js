/**
 * @author krish
 */

const teamModel = require('../model/team')
const formidable = require('formidable')
const fs = require('fs')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const saveTeam = async (req, res) => {
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
            const { name, role, description } = fields

            if (!name) {
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Please include name!'
                })
            }
            if (!role) {
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Please include role!'
                })
            }
            if (!description) {
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Please include description!'
                })
            }

            const team = new teamModel(fields)

            if (file.photo) {
                if (file.photo.size > 3000000) {
                    return res.status(SC.BAD_REQUEST).json({
                        error: 'File size is too big!'
                    })
                }
                team.photo.data = fs.readFileSync(file.photo.path)
                team.photo.contentType = file.photo.type
            }

            team.save((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                    return res.status(SC.BAD_REQUEST).json({
                        error: 'Saving data in DB failed!'
                    })
                }
                data.photo = undefined
                res.status(SC.OK).json({
                    message: 'Team saved successfully on DB!',
                    data: data
                })
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Save Team Function is Executed!')
    }
}

const getTeamById = async (req, res) => {
    try {
        await teamModel.findOne({ _id: req.params.id }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                data.photo = undefined
                res.status(SC.OK).json({
                    message: 'Team Fetched successfully from DB!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    message: 'No team found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Team Function is Executed!')
    }
}

const getAllTeams = async (req, res) => {
    try {
        await teamModel.find({}, { photo: 0 }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                data?.forEach((ele) => (ele.photo = undefined))
                res.status(SC.OK).json({
                    message: 'Teams Fetched successfully from DB!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    message: 'No teams found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All Teams Function is Executed!')
    }
}

const getTeamPhoto = async (req, res) => {
    const id = req.params.id
    try {
        await teamModel.findOne({ _id: id }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                res.set('Content-Type', data.photo.contentType)
                return res.status(SC.OK).send(data.photo.data)
            } else {
                res.status(SC.NOT_FOUND).json({
                    message: 'No team photo found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Team Photo Function is Executed')
    }
}

const updateTeamById = async (req, res) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true
    try {
        await teamModel.findOne({ _id: req.params.id }).exec((err, data) => {
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
                let { name, role, description } = fields

                !name ? (name = data.name) : name
                !role ? (role = data.role) : role
                !description ? (description = data.description) : description

                let teamData, type
                if (file.photo) {
                    if (file.photo.size > 3000000) {
                        return res.status(SC.BAD_REQUEST).json({
                            error: 'File size too big!'
                        })
                    }
                    teamData = fs.readFileSync(file.photo.path)
                    type = file.photo.type
                } else {
                    teamData = data.photo.data
                    type = data.photo.contentType
                }

                teamModel
                    .updateOne(
                        { _id: req.params.id },
                        {
                            $set: {
                                name: name,
                                role: role,
                                description: description,
                                photo: {
                                    data: teamData,
                                    contentType: type
                                }
                            }
                        }
                    )
                    .then(() => {
                        res.status(SC.OK).json({
                            message: 'Tean updated successfully!'
                        })
                    })
                    .catch(() => {
                        res.status(SC.BAD_REQUEST).json({
                            error: 'Team Updation Failed!'
                        })
                    })
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Update Team Function is Executed')
    }
}

const deleteTeamById = async (req, res) => {
    try {
        await teamModel
            .findByIdAndDelete({ _id: req.params.id })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data.deletedCount) {
                    res.status(SC.OK).json({
                        message: 'Team Document deleted successfully!'
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
        logger('Delete Team Function is Executed')
    }
}

module.exports = {
    saveTeam,
    getTeamById,
    getAllTeams,
    getTeamPhoto,
    updateTeamById,
    deleteTeamById
}
