const { query, response } = require('express')
const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

//Tạo sản phẩm
const createProduct = asyncHandler(async(req, res) => {
    if(Object.keys(req.body).length === 0) throw new Error('Please modified information!!!!!!')
    if(req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const product = await isExist(req.body.slug)
//Kiểm tra xem trong CSDL có tồn tại product không
    if(product){
        throw new Error('Product existed!!!!')
    }else{
        const newProduct = await Product.create(req.body)
        return res.status(200).json({
            success: newProduct ? true : false,
            createdProduct: newProduct ? newProduct : 'Cannot create new Product!! Please check your information!!!' 
        })
    }
})

//Kiểm tra sản phẩm có tồn tại không
const isExist = asyncHandler(async(slug) => {
    const existingProduct = await Product.findOne({slug})
    return existingProduct ? true : false
})

//Tìm kiếm sản phẩm 
const getProduct = asyncHandler(async (req,res)=>{
    const { pid } = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Product id invalid!!!!'  
    })
})
//Hiển thị danh sách sản phẩm 
const getProducts = asyncHandler(async (req,res)=>{
    const queries = {...req.query}
    // Tách các trường đặc biệt ra khỏi query
    const excludeField = ['limit', 'sort', 'page', 'fields']
    excludeField.forEach(el => delete queries[el])

    //Format lại các operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchesEl => `$${matchesEl}`)
    const formatedQueries = JSON.parse(queryString)
   
    //Filtering
    if(queries?.title) formatedQueries.title = {$regex: queries.title, $options: 'i'}
    let queryCommand = Product.find(formatedQueries)
    
    //Sorting
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        console.log(sortBy)
        queryCommand = queryCommand.sort(sortBy)
    }
    //FieldLimits
    if(req.query.fields){
        const fields = req.query.fields.split(',').join(' ')
        console.log(fields)
        queryCommand = queryCommand.select(fields)
    }
    //Pagination
    //limit: số record(bản ghi xuất ra màn hình)
    //skip: 
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1)  * limit
    queryCommand.skip(skip).limit(limit)
    //Execute query
    queryCommand.exec(async(err, response) => {
        if(err) throw new Error(err.message)
        const counts = await Product.find(formatedQueries).countDocuments()
        // const products = await Product.find()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            products: response ? response : 'Cannot get product!!!!'
              
        })
    })
})

//Cập nhập sản phẩm
const updateProduct = asyncHandler(async (req,res)=>{
    const { pid } = req.params
    if(req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {new: true})
    return res.status(200).json({
        success: updatedProduct ? true : false,
        productData: updatedProduct ? updatedProduct : 'Cannot update product!!!!'  
    })
})

//Xóa sản phẩm
const deleteProduct = asyncHandler(async (req,res)=>{
    const { pid } = req.params
    const deletedProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deletedProduct ? true : false,
        productData: deletedProduct ? deletedProduct : 'Cannot delete product!!!!'  
    })
})
//Rating
const ratings = asyncHandler(async(req, res) => {
    const {_id} = req.user
    const {star, comment, pid} = req.body
    if( !star || !pid ) throw new Error('Missing star and id information!!!!')
    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString()  === _id)
    // console.log({alreadyRating})
    if(alreadyRating){
        //true update star and comment
        await Product.updateOne({
            ratings: { $elemMatch: alreadyRating }
        },{
            $set: {"ratings.$.star" : star, "ratings.$.comment": comment}
        }, {new: true})
        console.log({$set: {"ratings.$.star" : star, "ratings.$.comment": comment}})
    }else{
        //add star and comment
        await Product.findByIdAndUpdate(pid, {
            $push: {ratings: {star, comment, postedBy: _id}}
        }, {new: true})
    }

    //Sum ratings
    const updatedProduct = await Product.findById(pid)
    const ratingCount = updatedProduct.ratings.length
    const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0)
    updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10

    await updatedProduct.save()

    return res.status(200).json({
        status: true,
        updatedProduct
    })
})

const uploadImageProducts = asyncHandler(async(req,res) =>{
    const { pid } = req.params
    if(!req.files) throw new Error('Missing input files')
    const response = await Product.findByIdAndUpdate(pid, {$push: {images: {$each: req.files.map(el => el.path)}}}, {new: true})
    return res.status(200).json({
        status: response ? true : false,
        uploadProduct: response ? response : 'Can not upload file!!!!'
    })
})

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImageProducts
}