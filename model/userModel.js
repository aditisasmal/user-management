const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto-browserify');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true,'please tell your name'] },
  email: { 
  	type: String, 
  	required: [true,'please tell your email'], 
  	unique: true,
  	lowercase: true
  },
  password: { 
  	type: String, 
  	required: [true,'please tell your password'], 
  	minlength: 8
  },

  type: { 
    type: String, 
    required: [true,'please tell user type']
  },

  passwordConfirm: { 
  	type: String, 
  	required: [true,'please tell your confirm password']
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});


userSchema.post('save', function(doc,next)
{
	console.log(doc);
	next();
});
userSchema.pre('save',async function(next)
{
  this.password = await bcrypt.hash(this.password,12);
  this.passwordConfirm = undefined;
  console.log(this.password);
  next();
});

userSchema.methods.correctPassword = async function(
candidatePassword,
userPassword)
{
 
  return await bcrypt.compare(candidatePassword,userPassword);
};

const User = mongoose.model('User',userSchema);


module.exports = User;