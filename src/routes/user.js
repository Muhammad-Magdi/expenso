const express = require('express');
const UserController = require('../controllers/user.controller');
const router = new express.Router();
const auth = require('../middleware/auth');

/**
 * Register New User
 * POST /api/users
 */
router.post('/', UserController.create);

/**
 * Login User using [email, password]
 * GET /api/users/login
 */
router.get('/login', UserController.login);

/**
 * Read Profile Date
 * GET /api/users/me
 */
router.get('/me', auth, UserController.get);

/**
 * Edit Profile
 * PUT /api/users/me
 */
router.put('/me', auth, UserController.update);

/**
 * Delete User Account
 */
router.delete('/me', auth, UserController.delete);
module.exports = router;
