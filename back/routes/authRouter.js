const express = require('express'),
authMiddleware = require('../middlewares/authMiddleware');

 const authController = require('../controllers/authController');
 const router = express.Router();

 //const Record = require('../models/R');

 router.post('/login', authController.auth);
 
 router.get('/refresh', authController.refresh);

 router.get('/logout', authController.logout);

 router.put('/checkpass', authController.checkPassword)

 router.get('/confirm', authController.confirm);
 
 module.exports = router;