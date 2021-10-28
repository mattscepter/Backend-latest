/**
 * @author krish
 */

const express = require('express')
const router = express.Router()
const {
    saveTestimonial,
    getTestimonialById,
    getAllTestimonials,
    getTestimonialPhoto,
    updateTestimonialById,
    deleteTestimonialById
} = require('../controller/testimonial')

const {
    isSignedIn,
    isValidToken,
    isAdmin
} = require('../controller/middleware')

router.post(
    '/testimonial/create',
    isSignedIn,
    isValidToken,
    isAdmin,
    saveTestimonial
)
router.get('/testimonial/get/:id', getTestimonialById)
router.get('/testimonial/get-all', getAllTestimonials)
router.get('/testimonal/get-photo/:id', getTestimonialPhoto)

router.put(
    '/testimonial/update/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    updateTestimonialById
)
router.delete(
    '/testimonial/delete/:id',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteTestimonialById
)

module.exports = router
