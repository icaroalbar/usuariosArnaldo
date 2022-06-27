const router = require('express').Router()

const UserController = require('../controllers/UserController')

router.post('/register', UserController.register)
router.post('/', UserController.login)
router.get('/', UserController.checkUser)

module.exports = router