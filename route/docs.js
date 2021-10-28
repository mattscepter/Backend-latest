/**
 * @author krish
 */

const express = require('express')
const router = express.Router()
const {
    uploadDocs,
    getDocById,
    getUserDocs,
    getAllUserDocs,
    getDocFile,
    updateDocs,
    deleteDocById,
    deleteDocs,
    approveDocs
} = require('../controller/docs')
const {
    isSignedIn,
    isValidToken,
    isAdmin
} = require('../controller/middleware')

router.post('/docs/upload', isSignedIn, isValidToken, uploadDocs)
router.post(
    '/docs/approve/:userId',
    isSignedIn,
    isValidToken,
    isAdmin,
    approveDocs
)
router.get('/docs/get/:id', isSignedIn, isValidToken, isAdmin, getDocById)
router.get('/docs/get-user', isSignedIn, isValidToken, getUserDocs)
router.get('/docs/get-users', isSignedIn, isValidToken, getAllUserDocs)
router.get('/docs/get-doc/:id', isSignedIn, isValidToken, getDocFile)
router.put('/docs/update', isSignedIn, isValidToken, updateDocs)
router.delete(
    '/docs/delete/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteDocById
)
router.delete(
    '/docs/delete-docs',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteDocs
)

module.exports = router
