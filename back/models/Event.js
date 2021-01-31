 const mongoose = require('mongoose');
 const { Schema } = mongoose;
 
 const Event = new Schema({
    title: String,
    start_date: Date,
    c1_date: Date,
    cplus_date: Date,
    finish_date: Date,
    participants: [{type:Schema.Types.ObjectId, ref: 'User'}],
    image: String
 });
 
 module.exports = mongoose.model('Event', Event);