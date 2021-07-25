const express = require('express');
const userController = require('./../controller/userControllers.js');
const router = express.Router();

router.route('/signup').post(userController.signup);
router.route('/login').post(userController.login);
router.route('/logout').get(userController.logout);
router.route('/save-location').post(userController.protected).post(userController.savelocation);
router.route('/search-location').post(userController.protected).post(userController.searchlocation);

module.exports = router;