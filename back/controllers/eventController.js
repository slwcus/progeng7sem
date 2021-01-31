//const auth = require('../middlewares/authMiddleware')
const Event = require('../models/Event');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const path = require('path');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const ms = require('ms')

dotenv.config({path: path.resolve(__dirname, '../config.env')});


const getEvents = async (req,res) => {
  let params = {}
  if(req.query.actual){
    params = {finish_date: { $gte: new Date()}}
  }
  const events = await Event.find(params)

  if(events){
    res.status(200).send({events:events})
  } else {
    res.status(404).send("Fail to find events")
  }
}

const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id)


  if(!event){
    return res.status(404).send("Fail to find events")
  }

  let users = await User.find({event: event})

  users.forEach(user => {
    user.event = null
    user.save()
  })

  Event.deleteOne({ _id: event._id }, function (err) {
    if (err) {return res.status(500).send("Fail to delete event")}
    else {return res.status(200).send("success")}
  });

}

const getEvent = async (req,res) => {
 
  const event = await Event.findById(req.params.id)

  if(event){
    res.status(200).send(event)
  } else {
    res.status(404).send("Fail to find events")
  }
}

const editEvent = async (req, res) => {

  const event = await Event.findById(req.params.id)

  if(!event){
    res.status(404).send("no such event")
  }

  event.title = req.body.title
  event.start_date = new Date(req.body.start_date)
  event.c1_date = new Date(req.body.c1_date)
  event.cplus_date = new Date(req.body.cplus_date)
  event.finish_date = new Date(req.body.finish_date)


  event.save(function (err) {
    if(err){
      console.log(err)
      res.status(500).send("error on save event")
    } else{
     res.status(200).send("success")
    }
  })

}


const addEvent = async (req, res) =>{

   let newEvent = new Event({
      title: req.body.title,
      start_date: req.body.start_date,
      c1_date: req.body.c1_date,
      cplus_date: req.body.cplus_date,
      finish_date: req.body.finish_date
   })

  newEvent.save(function(err) {
	    if (err) {
	    	res.status(500).send("Ошибка при создании события")
	    }
	});  
  // create reusable transporter object using the default SMTP transport  
  res.status(200).send("success")
};



exports.getEvent = getEvent
exports.getEvents = getEvents
exports.addEvent = addEvent
exports.editEvent = editEvent
exports.deleteEvent = deleteEvent