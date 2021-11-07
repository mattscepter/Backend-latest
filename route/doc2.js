const express = require('express')
const { getUsersDoc, getAllDocs } = require('../controller/docs2')
const {
    createDoc,
    reuploadDoc,
    getUsersDocAdmin,
    approveDoc
} = require('../controller/docs2')
const {
    isSignedIn,
    isValidToken,
    isAdmin
} = require('../controller/middleware')
const router = express.Router()

router.post('/docs2/create', isSignedIn, isValidToken, createDoc)
router.put('/docs2/reUpload', isSignedIn, isValidToken, reuploadDoc)
router.get('/docs2/getUserDocs', isSignedIn, isValidToken, getUsersDoc)
router.get(
    '/docs2/getUserDocsAdmin/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    getUsersDocAdmin
)
router.get('/docs2/getAllDocs', isSignedIn, isValidToken, isAdmin, getAllDocs)
router.put(
    '/docs2/approveDoc/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    approveDoc
)

module.exports = router
