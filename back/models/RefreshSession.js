 const bcrypt = require('bcrypt');
 const SALT_WORK_FACTOR = 10;
 const mongoose = require('mongoose');
 const { v4: uuidv4 } = require('uuid');
 const { Schema } = mongoose;
 
 const RefreshSession = new Schema({
   userId: String,
   refreshId: String,
   expiresIn: Number
 });
 
 module.exports = mongoose.model('RefreshSession', RefreshSession);