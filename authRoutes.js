const express = require('express');
const router = express.Router();
const authController = require('./authController');

router.get('/dashboard', authController.getDashboard);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.post('/logout', authController.postLogout);
router.use(authController.checkSession);
router.get('/extend-session', authController.extendSession);

module.exports = router;

// Posts routes
router.get('/posts', authController.ensureAuthenticated, authController.getPosts);
router.post('/posts', authController.ensureAuthenticated, authController.addComment);
