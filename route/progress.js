const express = require('express')
const {
    getAllProgress,
    getProgress,
    updateCurrentModule,
    updateCurrentChapter,
    updateCurrentTimestamp
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
router.put(
    `/progress/updateChapter`,
    isSignedIn,
    isValidToken,
    updateCurrentChapter
)
router.put(
    `/progress/updateTimestamp`,
    isSignedIn,
    isValidToken,
    updateCurrentTimestamp
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
