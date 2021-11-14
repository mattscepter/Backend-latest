/**
 * @author krish
 */

const express = require('express')
const router = express.Router()
const {
    createCoupon,
    updateCoupon,
    getCouponById,
    getAllCoupons,
    deleteCouponById,
    applyCoupon
} = require('../controller/coupon')

const {
    isSignedIn,
    isValidToken,
    isAdmin
} = require('../controller/middleware')

router.post('/coupon/create', isSignedIn, isValidToken, isAdmin, createCoupon)
router.post('/coupon/applyCoupon', isSignedIn, isValidToken, applyCoupon)

router.put(
    '/coupon/update/:couponId',
    isSignedIn,
    isValidToken,
    isAdmin,
    updateCoupon
)

router.get('/coupon/get/:couponId', isSignedIn, isValidToken, getCouponById)

router.get('/coupon/get-all', isSignedIn, isValidToken, getAllCoupons)

router.delete(
    '/coupon/delete/:couponId',
    isSignedIn,
    isValidToken,
    isAdmin,
    deleteCouponById
)

module.exports = router
