const router = require('express').Router()
const ctrls = require('../controllers/productController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

//method request
router.post('/create-product', [verifyAccessToken, isAdmin], ctrls.createProduct)
router.get('/getproducts', ctrls.getProducts)
//getById
router.put('/update-product/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct)
router.delete('/delete-product/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct)
router.get('/getproduct/:pid', ctrls.getProduct)


module.exports = router