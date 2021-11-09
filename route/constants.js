const express = require('express')
const {
    createConstant,
    getAllConstant,
    deleteConstant
} = require('../controller/constants')
const {
    isValidToken,
    isAdmin,
    isSignedIn
} = require('../controller/middleware')
const router = express.Router()

router.post(
    `/constant/create`,
    isSignedIn,
    isValidToken,
    isAdmin,
    createConstant
)

router.get(
    `/constant/getAll`,
    isSignedIn,
    isValidToken,
    isAdmin,
    getAllConstant
)

router.delete(
    `/constant/delete/:id`,
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteConstant
)

module.exports = router
