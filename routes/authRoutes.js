const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController.js');

// When a POST request comes to /register, call the registerUser function
router.post('/register', registerUser);

// When a POST request comes to /login, call the loginUser function
router.post('/login', loginUser);

module.exports = router;