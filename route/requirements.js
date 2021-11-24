/**
 * @author krish
 */

const express = require('express')
const router = express.Router()
const {
    createRequirement,
    updateRequirement,
    getRequirementById,
    getAllRequirements,
    getRequirementPhoto,
    deleteRequirementById
} = require('../controller/requirements')

const {
    isSignedIn,
    isValidToken,
    isAdmin
} = require('../controller/middleware')

router.post(
    '/requirement/create',
    isSignedIn,
    isValidToken,
    isAdmin,
    createRequirement
)

router.put(
    '/requirement/update/:requirementId',
    isSignedIn,
    isValidToken,
    isAdmin,
    updateRequirement
)

router.get(
    '/requirement/get/:requirementId',
    isSignedIn,
    isValidToken,
    isAdmin,
    getRequirementById
)
router.get('/requirement/get-all', getAllRequirements)
router.get('/requirement/get-photo/:requirementId', getRequirementPhoto)

router.delete(
    '/requirement/delete/:requirementId',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteRequirementById
)

module.exports = router
