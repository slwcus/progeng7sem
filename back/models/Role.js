 const mongoose = require('mongoose');
 const { Schema } = mongoose;
 
 const Role = new Schema({
 	id: Number,
   name: String,
   isTechnical: Boolean,
 });
 
 module.exports = mongoose.model('Role', Role);