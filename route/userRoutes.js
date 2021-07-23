const express = require('express');
const userController = require('./../controller/userControllers.js');
const router = express.Router();

router.route('/signup').post(userController.signup);
router.route('/login').post(userController.login);
module.exports = router;