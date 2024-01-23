const { response } = require('express')
const Brand = require('../models/brand')
const asyncHandler = require('express-async-handler')

const createBrand = asyncHandler(async(req, res) => {
    const brand = await Brand.create(req.body)
    return res.json({
        success: brand ? true : false,
        createdBrand: brand ? brand : 'Can not create new brand!!!!'
    })
})

const getAllBrand = asyncHandler(async(req, res) => {
    const brand = await Brand.find()
    return res.json({
        success: brand ? true : false,
        getBrands: brand ? brand : 'Can not find any brand!!!!'
    })
})


const updateBrand = asyncHandler(async(req, res) => {
    const {brid} = req.params
    const brand = await Brand.findByIdAndUpdate(brid, req.body, {new: true})
    return res.json({
        success: brand ? true : false,
        updatedBrand: brand ? brand : 'Can not update brand!!!!'
    })
})


const deleteBrand = asyncHandler(async(req, res) => {
    const {brid} = req.params
    const brand = await Brand.findByIdAndDelete(brid)
    return res.json({
        success: brand ? true : false,
        deletedBrand: brand ? brand : 'Can not delete brand!!!!'
    })
})

module.exports = {
    createBrand,
    getAllBrand,
    updateBrand,
    deleteBrand
}