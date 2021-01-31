const express = require('express'),
authMiddleware = require('../middlewares/authMiddleware');


 
 const userController = require('../controllers/userController');
 const authController = require('../controllers/authController');
 const router = express.Router();

 //const Record = require('../models/R');

 //middleware for checking token

 router.post('/register', userController.addUser);
 router.post('/confirm', userController.confirmEmail);
 router.post('/:id/upload', userController.uploadAvatar);

 router.get('/',authMiddleware.expjwt, userController.getUsers);
 
 router.get('/roles' ,userController.testadmin);
 
 router.put('/:id', authMiddleware.expjwt, userController.updateUser)


 
 router.put('/:id/assign', authMiddleware.expjwt,authMiddleware.isAdmin, userController.assignUser);
 router.put('/:id/unassign', authMiddleware.expjwt,authMiddleware.isAdmin, userController.unassignUser);

 router.delete('/:id', async (req, res) => {
    //await Record.findByIdAndRemove(req.params.id);
    //res.json({state: 'deleted'});
 });
 
 module.exports = router;