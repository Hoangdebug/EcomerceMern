const router = require('express').Router()
const ctrls = require('../controllers/categoryController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createCategory)
router.get('/', ctrls.getCategory)
router.put('/:cid', [verifyAccessToken, isAdmin], ctrls.updateCategory)
router.delete('/:cid', [verifyAccessToken, isAdmin], ctrls.deleteCategory)

module.exports = router 