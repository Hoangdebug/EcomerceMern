const { response } = require('express')
const Category = require('../models/category')
const asyncHandler = require('express-async-handler')

const createCategory = asyncHandler(async(req, res) => {
    const category = await Category.create(req.body)
    return res.json({
        success: category ? true : false,
        mes: category ? category : 'Can not create new category!!!!'
    })
})

const getCategory = asyncHandler(async(req, res) => {
    const category = await Category.find().select('title _id description')
    return res.json({
        success: category ? true : false,
        categories: category ? category : 'Can not find any category!!!!'
    })
})


const updateCategory = asyncHandler(async(req, res) => {
    const {cid} = req.params
    const category = await Category.findByIdAndUpdate(cid, req.body, {new: true})
    return res.json({
        success: category ? true : false,
        updateCategory: category ? category : 'Can not update category!!!!'
    })
})


const deleteCategory = asyncHandler(async(req, res) => {
    const {cid} = req.params
    const category = await Category.findByIdAndDelete(cid)
    return res.json({
        success: category ? true : false,
        deletedCategory: category ? category : 'Can not delete category!!!!'
    })
})

module.exports = {
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
}