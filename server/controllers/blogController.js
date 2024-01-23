const Blog = require('../models/blog')
const asyncHandler = require('express-async-handler')

const createNewBlog = asyncHandler(async(req, res) => {
    const { title, description, category } = req.body
    if(!title || !description || !category) throw new Error('Missing input')
    const response = await Blog.create(req.body)
    return res.json({
        success: response ? true : false,
        createdBlog: response ? response : 'Can not create new blog!!!!'
    })
})

const updateBlog = asyncHandler(async(req, res) => {
    const { bid } = req.params
    if(Object.keys(req.body).length === 0) throw new Error('Missing input')
    const response = await Blog.findByIdAndUpdate(bid, req.body, {new: true})
    return res.json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Can not update blog!!!!'
    })
})

const getAllBlog = asyncHandler(async(req, res) => {
    const response = await Blog.find()
    return res.json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Can not update blog!!!!'
    })
})

const deleteBlog = asyncHandler(async(req, res) => {
    const { bid } = req.params
    const response = await Blog.findOneAndDelete( bid )
    return res.json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Can not delete blog!!!!'
    })
})


//LIKE
//DISLIKE
/*
Khi nguời dùng like một bài blog
1. Check user have already disliked => choose disliked
2. Check user have already liked => choose liked 
 */

const likeBlog = asyncHandler(async(req, res) => {
    const { _id} = req.user
    const { bid } = req.params
    if(!bid) throw new Error('Missing blog Id')
    const blog = await Blog.findById(bid)
    const alreadyDisliked = blog?.dislikes?.find(el => el.toString() === _id)
    if(alreadyDisliked){
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {dislikes: _id} }, {new : true})
        return res.json({
            success: response ? true : false,
            rs: response  
        })
    } 
    const isLiked = blog?.likes?.find(el => el.toString() === _id)
    if(isLiked){
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {likes: _id} }, {new : true})
        return res.json({
            success: response ? true : false,
            rs: response  
        })
    }else{
        const response = await Blog.findByIdAndUpdate(bid, {$push: {likes: _id} }, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response  
        })
    }
})

const dislikedBlog = asyncHandler(async(req, res) => {
    const { _id} = req.user
    const { bid } = req.params
    if(!bid) throw new Error('Missing blog Id')
    const blog = await Blog.findById(bid)
    const alreadyLiked = blog?.likes?.find(el => el.toString() === _id)
    if(alreadyLiked){
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {likes: _id} }, {new : true})
        return res.json({
            success: response ? true : false,
            rs: response  
        })
    } 
    const isDisliked = blog?.dislikes?.find(el => el.toString() === _id)
    if(isDisliked){
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {dislikes: _id} }, {new : true})
        return res.json({
            success: response ? true : false,
            rs: response  
        })
    }else{
        const response = await Blog.findByIdAndUpdate(bid, {$push: {dislikes: _id} }, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response  
        })
    }
})


const getBlog = asyncHandler(async(req, res) => {
    const { bid } = req.params
    const blog = await Blog.findByIdAndUpdate(bid, { $inc: {numberViews: 1}}, {new: true})
    .populate('likes', 'lastname firstname')
    .populate('dislikes', 'lastname firstname')
    return res.json({
        success: blog ? true : false,
        rs: blog      
    })
})

const uploadImageBlog = asyncHandler(async(req,res) =>{
    const { bid } = req.params
    if(!req.file) throw new Error('Missing input files')
    const response = await Blog.findByIdAndUpdate(bid, { images: req.file.path }, {new: true})
    return res.status(200).json({
        status: response ? true : false,
        uploadBlog: response ? response : 'Can not upload file!!!!'
    })
})

module.exports = {
    createNewBlog,
    updateBlog,
    getAllBlog,
    deleteBlog,
    likeBlog,
    dislikedBlog,
    getBlog,
    uploadImageBlog
}