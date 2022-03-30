const express = require('express')
const AuthController = require('../controller/controller.auth')
const auth = require('../middleware/middleware.auth')

const router = express.Router()

router.post('/signin',AuthController.signin);

router.post('/signup',AuthController.signup);

module.exports = router