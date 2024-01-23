const router = require('express').Router()
const ctrls = require('../controllers/brandController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createBrand)
router.get('/', ctrls.getAllBrand)
router.put('/:brid', [verifyAccessToken, isAdmin], ctrls.updateBrand)
router.delete('/:brid', [verifyAccessToken, isAdmin], ctrls.deleteBrand)

module.exports = router 