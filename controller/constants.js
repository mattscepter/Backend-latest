/**
 * @author utkarsh
 */

const constantModel = require('../model/constants')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const createConstant = async (req, res) => {
    const { name, text } = req.body
    try {
        const constant = new constantModel({ name, text })
        await constant
            .save()
            .then(() => {
                res.status(SC.OK).json({
                    message: 'Constant saved successfully'
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                res.status(SC.BAD_REQUEST).json({
                    error: 'Error creating constant'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Create Constant Function is Executed')
    }
}

const getAllConstant = async (req, res) => {
    const name = req.query.name
    try {
        await constantModel
            .find({ name })
            .then((data) => {
                res.status(SC.OK).json({
                    message: 'Constant fetched successfully',
                    data: data
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                res.status(SC.BAD_REQUEST).json({
                    error: 'Error fetching constant'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Fetch All Constant Function is Executed')
    }
}

const deleteConstant = async (req, res) => {
    const id = req.params.id
    try {
        await constantModel
            .deleteOne({ _id: id })
            .then(() => {
                res.status(SC.OK).json({
                    message: 'Constant deleted successfully'
                })
            })
            .catch((err) => {
                logger(err, 'ERROR')
                res.status(SC.BAD_REQUEST).json({
                    error: 'Error deleting constant'
                })
            })
    } catch (error) {
        logger(error, 'ERROR')
    } finally {
        logger('Delete Constant Function is Executed')
    }
}

module.exports = {
    createConstant,
    getAllConstant,
    deleteConstant
}
