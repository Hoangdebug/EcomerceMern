const router = require('express').Router()
const ctrls = require('../controllers/blogController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/', [verifyAccessToken, isAdmin] ,ctrls.createNewBlog)
router.get('/', [verifyAccessToken, isAdmin] ,ctrls.getAllBlog)
router.put('/uploadimage/:bid', [verifyAccessToken, isAdmin], uploader.single('images'), ctrls.uploadImageBlog)
router.get('/one/:bid', ctrls.getBlog)
router.put('/like/:bid', [verifyAccessToken] ,ctrls.likeBlog)
router.put('/dislike/:bid', [verifyAccessToken] ,ctrls.dislikedBlog)
router.put('/:bid', [verifyAccessToken, isAdmin] ,ctrls.updateBlog)
router.delete('/:bid', [verifyAccessToken, isAdmin] ,ctrls.deleteBlog)

module.exports = router