const User = require('./../model/userModel.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-browserify');
const { promisify }  = require('util');

exports.signup = async (req,res,next) =>
{
	try{
		console.log(req.body);
		const newUser = await User.create(req.body);
		const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECTET, {expiresIn: process.env.JWT_EXPIRES_IN});
    	
		const cookieOption = {
			expires: new Date(
				Date.now() + process.env.JWT_COOKIE_EXPIRES_IN
				),
			secure: true,
			httpOnly: true
		};
		res.cookie('jwt',token,cookieOption);
    	res.status(200).json({
        	status : 'success',
        	token,
        	data:{
            	user: newUser
        	}
        });
	}catch(err){
		res.status(400).json({
			status: 'fail',
			message: err
		});
	}
    
}

exports.login = async (req,res,next) =>
{
	try{
		const {email,password} = req.body;

		const user = await User.findOne({email}).select('+password');
		const correct = await user.correctPassword(password,user.password);
		if(!correct)
		{
			res.status(400).json({
			status: 'fail',
				message: err
			});
		}
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECTET, {expiresIn: process.env.JWT_EXPIRES_IN});
    	res.status(200).json({
        	status : 'success',
        	token
        	
        });
	}catch(err){
		console.log(err);
		res.status(400).json({
			status: 'fail',
			message: err
		});
	}
    
}

