/**
 * @author krish
 */

const express = require('express')
const router = express.Router()
const {
    saveTeam,
    getTeamById,
    getAllTeams,
    getTeamPhoto,
    updateTeamById,
    deleteTeamById
} = require('../controller/team')
const {
    isSignedIn,
    isValidToken,
    isAdmin
} = require('../controller/middleware')

router.post('/team/create', isSignedIn, isValidToken, isAdmin, saveTeam)
router.get('/team/get/:id', getTeamById)
router.get('/team/get-all', getAllTeams)
router.get('/team/get-photo/:id', getTeamPhoto)
router.put(
    '/team/update/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    updateTeamById
)
router.delete(
    '/team/delete/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteTeamById
)

module.exports = router
