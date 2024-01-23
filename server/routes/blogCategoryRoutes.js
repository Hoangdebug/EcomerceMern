const router = require('express').Router()
const ctrls = require('../controllers/blogCategoryController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.get('/', ctrls.getBlogCategory)
router.post('/', [verifyAccessToken, isAdmin], ctrls.createBlogCategory)
router.put('/:bcid', [verifyAccessToken, isAdmin], ctrls.updateBlogCategory)
router.delete('/:bcid', [verifyAccessToken, isAdmin], ctrls.deleteBlogCategory)

module.exports = router 