//const auth = require('../middlewares/authMiddleware')
const Document = require('../models/Document');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const path = require('path');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const ms = require('ms')

dotenv.config({path: path.resolve(__dirname, '../config.env')});


const getDocument = async (req,res) => {
 
  const doc = await Document.findById(req.params.id).populate('event_id')

  if(doc){
    res.status(200).send(doc)
  } else {
    res.status(404).send("Fail to find document")
  }
}

const editDocument = async (req, res) => {

  const doc = await Document.findById(req.params.id)

  if(!doc){
    res.status(404).send("no such doc")
  }

  doc.title = req.body.title
  doc.day = req.body.day
  doc.role = req.body.role
  doc.content = req.body.content


  doc.save(function (err) {
    if(err){
  
      res.status(500).send("error on save event")
    } else{
     res.status(200).send("success")
    }
  })

}

const deleteDocument = async (req,res) => {
   const doc = await Document.findById(req.params.id)

  if(!doc){
    res.status(404).send("no such doc")
  }

  doc.deleted = true

  doc.save(function (err) {
    if(err){
 
      res.status(500).send("error on save doc")
    } else{
     res.status(200).send("success")
    }
  })
}

const getDocuments = async (req,res) => {


  let params = {deleted: false}
  if(req.query.foruser){

    let user = await User.findById(req.user.data.id)

    params = Object.assign({}, params,{event_id: user.event})
  }

  const documents = await Document.find(params).populate('event_id')

  if(documents){
    res.status(200).send({documents:documents})
  } else {
    res.status(404).send("Fail to find documents")
  }
}

const signDocument = async (req,res) => {


  const user = await User.findById(req.user.data.id)

  if(!user){
     return res.status(404).send("no such user")
  }

  if(user.pin != req.body.pin){
    return res.status(403).send("wrong pin")
  }

   Document.findByIdAndUpdate(req.params.id, {signed_by: user}, function(err){
      if(err)
        res.status(500).send("sign document failed")
   })
   res.status(200).send("success")
  
}

const unsignDocument = (req,res) => {

  
   Document.findByIdAndUpdate(req.params.id, {signed_by: null}, function(err){
      if(err)
        res.status(500).send("unsign document failed")
   })
   res.status(200).send("success")
  
}

const updateDocument = (req,res) => {

  //signed cannot be changed

   Document.findByIdAndUpdate(req.params.id, {event: Event.findById(req.params.event_id).exec(),
    day: req.body.day,content: req.body.content, role: req.body.role}, function(err){
      if(err)
        res.status(500).send("unsign document failed")
   })
   res.status(200).send("success")
  
}

exports.updateDocument = updateDocument
exports.unsignDocument = unsignDocument
exports.signDocument = signDocument
exports.getDocuments = getDocuments
exports.getDocument = getDocument
exports.editDocument = editDocument
exports.deleteDocument = deleteDocument

const addDocument = async (req, res) =>{

   let addDocument = new Document({
      title: req.body.title,
      day: req.body.day,
      event_id: req.body.event_id,
      content: req.body.content,
      role: req.body.role,
      deleted: false
   })

  addDocument.save(function(err) {
	    if (err) {
	    	res.status(500).send("Error while save document")
	    } else {
        res.status(200).send("success")
      }
	});  
  // create reusable transporter object using the default SMTP transport  

};

exports.addDocument = addDocument
