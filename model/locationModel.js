const mongoose = require('mongoose');
const User = require('./userModel');

const locationSchema = new mongoose.Schema({
  city: { type: {type:String}, coordinates: [Number]},
  location: { type: String },
  user:[
  {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
});
locationSchema.index({
    startLocation: "2dsphere",
})
const Location = mongoose.model('Location',locationSchema);
module.exports = Location;