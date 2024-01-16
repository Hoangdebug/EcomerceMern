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
    const products = await Product.find()
    return res.status(200).json({
        success: products ? true : false,
        productDatas: products ? products : 'Cannot get product!!!!'  
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

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct
}