 const mongoose = require('mongoose');
 const { Schema } = mongoose;
 
 const Document = new Schema({
    title: String,
    day: String,
    content: String,
    role: Number,
    event_id: {type: Schema.Types.ObjectId, ref: 'Event'},
    signed_by: {type: Schema.Types.ObjectId, ref:'User'},
    deleted: Boolean
 });
 
 module.exports = mongoose.model('Document', Document);