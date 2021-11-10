const express = require('express')
const {
    getAllProgress,
    getProgress,
    updateCurrentModule
} = require('../controller/progress')
const {
    isValidToken,
    isAdmin,
    isSignedIn
} = require('../controller/middleware')

const router = express.Router()

router.put(
    `/progress/updateModule`,
    isSignedIn,
    isValidToken,
    updateCurrentModule
)

router.get(
    `/progress/getAll`,
    isSignedIn,
    isValidToken,
    isAdmin,
    getAllProgress
)

router.get(`/progress/get`, isSignedIn, isValidToken, getProgress)

module.exports = router
