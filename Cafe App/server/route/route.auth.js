const express = require('express')
const AuthController = require('../controller/controller.auth')
const auth = require('../middleware/middleware.auth')

const router = express.Router()

router.post('/signin',AuthController.signin);

router.post('/signup',AuthController.signup);

// router.get('/signout',AuthController.signout)

router.get('/get/currentuser',auth,AuthController.getCurrentUser)

router.get('/get/:email',AuthController.getUserByEmail)

router.get('/', auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
  });

module.exports = router