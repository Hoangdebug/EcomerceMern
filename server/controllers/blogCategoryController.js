const blogCategory = require('../models/blogCategory')
const asyncHandler = require('express-async-handler')

const createBlogCategory = asyncHandler(async(req, res) => {
    const blogCate = await blogCategory.create(req.body)
    return res.json({
        success: blogCate ? true : false,
        mes: blogCate ? blogCate : 'Can not create new blog category!!!!'
    })
})

const getBlogCategory = asyncHandler(async(req, res) => {
    const blogCate = await blogCategory.find().select('title _id description')
    return res.json({
        success: blogCate ? true : false,
        categories: blogCate ? blogCate : 'Can not find any blog category!!!!'
    })
})


const updateBlogCategory = asyncHandler(async(req, res) => {
    const {bcid} = req.params
    const blogCate = await blogCategory.findByIdAndUpdate(bcid, req.body, {new: true})
    return res.json({
        success: blogCate ? true : false,
        updateCategory: blogCate ? blogCate : 'Can not update blog category!!!!'
    })
})


const deleteBlogCategory = asyncHandler(async(req, res) => {
    const {bcid} = req.params
    const blogCate = await blogCategory.findByIdAndDelete(bcid)
    return res.json({
        success: blogCate ? true : false,
        deletedCategory: blogCate ? blogCate : 'Can not delete blog category!!!!'
    })
})

module.exports = {
    createBlogCategory,
    getBlogCategory,
    updateBlogCategory,
    deleteBlogCategory
}