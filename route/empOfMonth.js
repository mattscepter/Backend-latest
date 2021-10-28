/**
 * @author krish
 */

const express = require('express')
const router = express.Router()
const {
    saveEOM,
    getEOMById,
    getEOM,
    getEOMByMonth,
    getAllEMOS,
    getEOMPhoto,
    updateEOMById,
    deleteEOMById
} = require('../controller/empOfMonth')
const {
    isSignedIn,
    isValidToken,
    isAdmin
} = require('../controller/middleware')

router.post('/eom/create', isSignedIn, isValidToken, isAdmin, saveEOM)
router.get('/eom/get-id/:id', getEOMById)
router.get('/eom/get', getEOM)
router.get(
    '/eom/get-month/:month',
    isSignedIn,
    isValidToken,
    isAdmin,
    getEOMByMonth
)
router.get('/eom/get-all', isSignedIn, isValidToken, isAdmin, getAllEMOS)
router.get('/eom/get-photo/:id', getEOMPhoto)
router.put('/eom/update/:id', isSignedIn, isValidToken, isAdmin, updateEOMById)
router.delete(
    '/eom/delete/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteEOMById
)

module.exports = router
