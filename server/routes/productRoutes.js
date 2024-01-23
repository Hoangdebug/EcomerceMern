const router = require('express').Router()
const ctrls = require('../controllers/productController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

//method request
router.post('/create-product', [verifyAccessToken, isAdmin], ctrls.createProduct)
router.get('/getproducts', ctrls.getProducts)
router.put('/getproduct/ratings', verifyAccessToken, ctrls.ratings)
//getById
router.put('/uploadimage/:pid', [verifyAccessToken, isAdmin], uploader.array('images', 10), ctrls.uploadImageProducts)
router.put('/update-product/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct)
router.delete('/delete-product/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct)
router.get('/getproduct/:pid', ctrls.getProduct)


module.exports = router