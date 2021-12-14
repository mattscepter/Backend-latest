const express = require('express')
const {
    getMyPurchases,
    getUsersPurchases,
    makePurchase
} = require('../controller/myPurchases')
const {
    isValidToken,
    isAdmin,
    isSignedIn
} = require('../controller/middleware')

const router = express.Router()

router.get(`/myPurchases/get`, isSignedIn, isValidToken, getMyPurchases)

router.get(
    `/myPurchases/getAdmin/:id`,
    isSignedIn,
    isValidToken,
    isAdmin,
    getUsersPurchases
)

router.post('/myPurchases/add', isSignedIn, isValidToken, makePurchase)

module.exports = router
