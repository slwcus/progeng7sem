const express = require('express'),
authMiddleware = require('../middlewares/authMiddleware');


 
 const eventController = require('../controllers/eventController');
 const authController = require('../controllers/authController');
 const router = express.Router();

 //const Record = require('../models/R');

 //middleware for checking token

 router.get('/:id',authMiddleware.expjwt,eventController.getEvent);
 router.delete('/:id',authMiddleware.expjwt,eventController.deleteEvent);
 router.put('/:id',authMiddleware.expjwt,eventController.editEvent);
 router.get('/',authMiddleware.expjwt,eventController.getEvents);

 router.post('/',authMiddleware.expjwt,authMiddleware.isAdmin ,eventController.addEvent);
 
 //router.get('/',authMiddleware.expjwt, userController.getUsers);
 
 
 
 router.delete('/:id', async (req, res) => {
    //await Record.findByIdAndRemove(req.params.id);
    //res.json({state: 'deleted'});
 });
 
 module.exports = router;