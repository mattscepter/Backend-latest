const express = require('express')
const {
    buyCourse,
    buyCourseAdmin,
    createCourse,
    createModule,
    createChapter,
    addSlide,
    addQuestion,
    getAllCourse,
    getUsersCourses,
    getCourse,
    getModule,
    getChapter,
    getSlideImage,
    deleteCourse,
    deleteModule,
    deleteChapter,
    deleteSlide,
    editChapter,
    editModule,
    editCourse,
    getDuration
} = require('../controller/courseMaterial')
const {
    isValidToken,
    isAdmin,
    isSignedIn,
    hasCourseorAdmin
} = require('../controller/middleware')
const router = express.Router()

router.post('/material/buyCourse', isSignedIn, isValidToken, buyCourse)
router.post(
    '/material/buyCourseAdmin',
    isSignedIn,
    isValidToken,
    isAdmin,
    buyCourseAdmin
)

router.post(
    '/material/addCourse',
    isSignedIn,
    isValidToken,
    isAdmin,
    createCourse
)
router.post(
    '/material/addModule',
    isSignedIn,
    isValidToken,
    isAdmin,
    createModule
)
router.post(
    '/material/addChapter',
    isSignedIn,
    isValidToken,
    isAdmin,
    createChapter
)
router.put('/material/addSlide', isSignedIn, isValidToken, isAdmin, addSlide)
router.put(
    '/material/addQuestion',
    isSignedIn,
    isValidToken,
    isAdmin,
    addQuestion
)

router.get('/material/getAllCourses', isSignedIn, isValidToken, getAllCourse)

router.get(
    '/material/getUsersCourses',
    isSignedIn,
    isValidToken,
    getUsersCourses
)

router.get(
    '/material/getCourse/:courseId',
    isSignedIn,
    isValidToken,
    hasCourseorAdmin,
    getCourse
)
router.get(
    '/material/getModule/:courseId/:id',
    isSignedIn,
    isValidToken,
    hasCourseorAdmin,
    getModule
)
router.get(
    '/material/getChapter/:courseId/:id',
    isSignedIn,
    isValidToken,
    hasCourseorAdmin,
    getChapter
)
router.get('/material/getSlideImg/:courseId/:chapterId/:slideId', getSlideImage)

router.delete(
    '/material/deleteCourse/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteCourse
)
router.delete(
    '/material/deleteModule/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteModule
)
router.delete(
    '/material/deleteChapter/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteChapter
)
router.delete(
    '/material/deleteSlide/:chapterId/:slideId',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteSlide
)
router.put(
    '/material/editCourse/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    editCourse
)
router.put(
    '/material/editModule/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    editModule
)
router.put(
    '/material/editChapter/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    editChapter
)

router.post('/material/getDuration', isSignedIn, isValidToken, getDuration)

module.exports = router
