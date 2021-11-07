/**
 * @author krish
 */

const classModel = require('../model/class')
const userModel = require('../model/user')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const createClass = async (req, res) => {
    let result = {
        instructorId: '',
        instructorName: '',
        classname: '',
        date: '',
        location: '',
        noOfSpots: 0,
        students: []
    }
    const instructorId = req.params.instructorId
    const { classname, date, location, noOfSpots, students } = req.body
    try {
        await userModel.findOne({ _id: instructorId }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                result.instructorId = instructorId
                result.instructorName = data.name
                result.classname = classname
                result.date = date ? date : null
                result.location = location ? location : null
                result.noOfSpots = noOfSpots ? noOfSpots : 0
                result.students = students ? students : []

                const newClass = new classModel(result)
                newClass.save((err, data) => {
                    if (err) {
                        logger(err, 'ERROR')
                        return res.status(SC.BAD_REQUEST).json({
                            error: 'Creating Class in DB is failed!'
                        })
                    }
                    res.status(SC.OK).json({
                        message: 'Class created successfully!',
                        data: data
                    })
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No Instructor found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Create Class Function is Executed!')
    }
}

const enrollStudents = async (req, res) => {
    const students = req.body.students
    try {
        students === undefined
            ? res.status(SC.BAD_REQUEST).json({
                  error: 'Students is undefined'
              })
            : await classModel
                  .updateOne(
                      { _id: req.params.classId },
                      {
                          $set: {
                              students
                          }
                      }
                  )
                  .then(() => {
                      res.status(SC.OK).json({
                          message: 'Students enrolled successfully!'
                      })
                  })
                  .catch(() => {
                      res.status(SC.BAD_REQUEST).json({
                          error: 'Students enrollment Failed!'
                      })
                  })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Enroll Students Function is Executed!')
    }
}

const removeStudents = async (req, res) => {
    const students = req.body.students
    try {
        await classModel
            .updateOne(
                { _id: req.params.classId },
                {
                    $pull: {
                        students: {
                            studentId: {
                                $in: students
                            }
                        }
                    }
                }
            )
            .then(() => {
                res.status(SC.OK).json({
                    message: 'Student removed successfully from this class!'
                })
            })
            .catch((err) => {
                res.status(SC.BAD_REQUEST).json({
                    error: 'Removing student class is failed!'
                })
                logger(err, 'ERROR')
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Remove Students Function is Executed!')
    }
}

const updateClass = async (req, res) => {
    const { classname, instructor, date, location, noOfSpots } = req.body
    try {
        await userModel.findOne({ _id: instructor }).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                classModel
                    .updateOne(
                        { _id: req.params.classId },
                        {
                            $set: {
                                classname,
                                instructorId: instructor,
                                instructorName: data.name,
                                date,
                                location,
                                noOfSpots
                            }
                        }
                    )
                    .then(() => {
                        res.status(SC.OK).json({
                            message: 'Class updated successfully!'
                        })
                    })
                    .catch((err) => {
                        res.status(SC.BAD_REQUEST).json({
                            error: 'Class updation failed!'
                        })
                        logger(err, 'ERROR')
                    })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No Instructor found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Update Class Function is Executed!')
    }
}

const getClassById = async (req, res) => {
    try {
        await classModel
            .findOne({ _id: req.params.classId })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'Class fetched successfully!',
                        data: data
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No Classes found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Class Function is Executed')
    }
}

const getAllClasses = async (req, res) => {
    try {
        await classModel.find({}).exec((err, data) => {
            if (err) {
                logger(err, 'ERROR')
            }
            if (data) {
                res.status(SC.OK).json({
                    message: 'Classes fetched successfully!',
                    data: data
                })
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'No Classes found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get All Classes Function is Executed')
    }
}

const getStudentClasses = async (req, res) => {
    const studentId = req.params.studentId
    try {
        await classModel
            .find({
                students: {
                    $elemMatch: {
                        studentId: studentId
                    }
                }
            })
            .exec((err, data) => {
                if (err) {
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'Student Classes fetched successfully!',
                        data: data
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No Classes found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Student Classes Function is Executed')
    }
}

const deleteClassById = async (req, res) => {
    try {
        await classModel
            .findByIdAndDelete({ _id: req.params.classId })
            .exec((err, data) => {
                if (err) {
                    res.status(SC.BAD_REQUEST).json({
                        error: 'Deleting class from DB is failed!'
                    })
                    logger(err, 'ERROR')
                }
                if (data) {
                    res.status(SC.OK).json({
                        message: 'Class deleted successfully!'
                    })
                } else {
                    res.status(SC.NOT_FOUND).json({
                        error: 'No classes found!'
                    })
                }
            })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Delete Class Function is Executed!')
    }
}

module.exports = {
    createClass,
    enrollStudents,
    removeStudents,
    updateClass,
    getClassById,
    getAllClasses,
    getStudentClasses,
    deleteClassById
}
