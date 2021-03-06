const router = require('express').Router()
const UserController = require('./controllers/UserController')
const verifyToken = require('./helpers/verifyToken')
const { imageUpload } = require('./helpers/imageUpload')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkuser', UserController.checkUser)
router.get('/checkuser/:id', UserController.getUserById)
router.patch('/edit/:id', verifyToken, imageUpload.single('image'), UserController.editUser)
router.post('/forgot', UserController.forgotPassword)
router.post('/forgot/reset', UserController.resetPassword)

module.exports = router