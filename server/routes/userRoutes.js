const router = require('express').Router()
const ctrls = require('../controllers/userController')

//method request
router.post('/register', ctrls.register)


module.exports = router