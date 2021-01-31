const express = require('express'),
authMiddleware = require('../middlewares/authMiddleware');


 
 const utilityController = require('../controllers/utilityController');
 const authController = require('../controllers/authController');
 const router = express.Router();

 //const Record = require('../models/R');

 //middleware for checking token

 router.get('/roles',authMiddleware.expjwt,utilityController.getRoles);
 
 module.exports = router;