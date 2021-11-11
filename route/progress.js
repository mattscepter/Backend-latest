const express = require('express')
const {
    getAllProgress,
    getProgress,
    updateCurrentModule,
    updateCurrentChapter,
    updateCurrentSlide,
    updateCurrentTimestamp,
    updateCompletedModule,
    updateCompletedChapter
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
    `/progress/updateSlide`,
    isSignedIn,
    isValidToken,
    updateCurrentSlide
)

router.put(
    `/progress/updateTimestamp`,
    isSignedIn,
    isValidToken,
    updateCurrentTimestamp
)

router.put(
    `/progress/updateCompletedModule`,
    isSignedIn,
    isValidToken,
    updateCompletedModule
)

router.put(
    `/progress/updateCompletedChapter`,
    isSignedIn,
    isValidToken,
    updateCompletedChapter
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
