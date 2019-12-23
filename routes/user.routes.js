const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users-controller');

router.get('/', usersController.rootUser);
router.post('/newUser', usersController.registerUser);

module.exports = router;
