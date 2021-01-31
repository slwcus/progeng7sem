const express = require('express'),
authMiddleware = require('../middlewares/authMiddleware');


 
 const documentController = require('../controllers/documentController');
 const authController = require('../controllers/authController');
 const router = express.Router();

 //const Record = require('../models/R');

 //middleware for checking token

 router.get('/',authMiddleware.expjwt,documentController.getDocuments);

 router.get('/:id',authMiddleware.expjwt,documentController.getDocument);

 router.put('/:id',authMiddleware.expjwt,documentController.editDocument);

 router.delete('/:id',authMiddleware.expjwt,documentController.deleteDocument);

 router.post('/',authMiddleware.expjwt,authMiddleware.isAdmin ,documentController.addDocument);
 
 //router.get('/',authMiddleware.expjwt, userController.getUsers);
 
 
 router.put('/:id/sign', authMiddleware.expjwt,documentController.signDocument);
 router.put('/:id/unsign', authMiddleware.expjwt,documentController.unsignDocument);

  router.put('/:id/unsign', authMiddleware.expjwt,documentController.updateDocument);
 
 router.delete('/:id', async (req, res) => {
    //await Record.findByIdAndRemove(req.params.id);
    //res.json({state: 'deleted'});
 });
 
 module.exports = router;