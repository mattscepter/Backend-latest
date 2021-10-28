/**
 * @author krish
 */

const express = require('express')
const router = express.Router()
const {
    saveClient,
    getClientById,
    getAllClient,
    getClientPhoto,
    updateClientById,
    deleteClientById
} = require('../controller/client')
const {
    isSignedIn,
    isValidToken,
    isAdmin
} = require('../controller/middleware')

router.post('/client/create', isSignedIn, isValidToken, isAdmin, saveClient)
router.get('/client/get/:id', getClientById)
router.get('/client/get-all', getAllClient)
router.put(
    '/client/update/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    updateClientById
)
router.get('/client/get-photo/:id', getClientPhoto)
router.delete(
    '/client/delete/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteClientById
)

module.exports = router
