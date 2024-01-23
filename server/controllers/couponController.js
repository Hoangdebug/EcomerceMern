const Coupon = require('../models/coupon')
const asyncHandler = require('express-async-handler')

const createNewCoupon = asyncHandler(async(req, res) => {
    const { name, discount, expiry } = req.body
    if(!name || !discount || !expiry) throw new Error('Missing input')
    const response = await Coupon.create({
        ...req.body, 
        expiry: Date.now() + +expiry*24*60*60*1000
    })
    return res.json({
        success: response ? true : false,
        createdCoupon: response ? response : 'Can not create new coupon!!!!'
    })
})

const getCoupon = asyncHandler(async(req, res) => {
    const response = await Coupon.find().select('-createdAt -updatedAt')
    return res.json({
        success: response ? true : false,
        createdCoupon: response ? response : 'Can not get any coupon!!!!'
    })
})

const updateCoupon = asyncHandler(async(req, res) => {
    const { cpid } = req.params
    if(Object.keys(req.body).length === 0) throw new Error('Missing input')
    if(req.body.expiry) req.body.expiry = Date.now() + +req.body.expiry*24*60*60*1000
    const response = await Coupon.findByIdAndUpdate(cpid, req.body, {new: true})
    return res.json({
        success: response ? true : false,
        updatedCoupon: response ? response : 'Can not update coupon!!!!'
    })
})

const deleteCoupon = asyncHandler(async(req, res) => {
    const { cpid } = req.params
    const response = await Coupon.findByIdAndDelete(cpid)
    return res.json({
        success: response ? true : false,
        deletedCoupon: response ? response : 'Can not delete coupon!!!!'
    })
})

module.exports = {
    createNewCoupon,
    getCoupon,
    updateCoupon,
    deleteCoupon
}