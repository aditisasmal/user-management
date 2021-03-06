const { validationResult } = require("express-validator");
const User = require('./../model/userModel.js');
const Location = require('./../model/locationModel.js');

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
			httpOnly: true,
    		secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
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

exports.getLogin = (req,res) =>
{
	console.log('fd');
	res.status(200).render('login');
    
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
		const cookieOption = {
			expires: new Date(
				Date.now() + process.env.JWT_COOKIE_EXPIRES_IN
				),
			secure: true,
			httpOnly: true,
    		secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
		};
		res.cookie('jwt',token,cookieOption);
		const decoded   = await promisify(jwt.verify)(token, process.env.JWT_SECTET);

		const freshuser = await User.findOne({_id:decoded.id});
		res.status(200).json({
							status: 'true',
							message: token,
							userInfo: freshuser
						});
		console.log(token);
    	
	}catch(err){
		console.log(err);
		res.status(400).json({
			status: 'fail',
			message: err
		});
	}
    
}

exports.protected = async(req,res,next) =>
{
	try{
	let token12;

	if(req.headers.authorization)
	{
		token12 = req.headers.authorization.split(' ')[1];
	}else{
		res.status(400).json({
			status: 'fail',
				message: "wrong token"
			});
	}
	
	const decoded   = await promisify(jwt.verify)(token12, process.env.JWT_SECTET);

	const freshuser = await User.findOne({_id:decoded.id});
	console.log(freshuser);
	if(!freshuser)
		{
			res.status(400).json({
			status: 'fail',
				message: "wrong token"
			});
		}
	req.user = freshuser;
	next();
	}catch(err){
		console.log(err);
		res.status(400).json({
			status: 'fail',
			message: err
		});
	}
}

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() - 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
}


exports.savelocation = async(req,res,next) =>
{
	try{
	
	req.body.user = req.user.id;


		await Location.create(req.body);
		res.status(200).json({
							status: 'true',
							message: "Save location Sucessfully"
						});
	}catch(err){
		console.log(err);
		res.status(400).json({
			status: 'fail',
			message: err
		});
	}
	
}


exports.searchlocation = async(req,res,next) =>
{
	try{
		
		req.body.user = req.user.id;
		
		const location = await Location.find(
   		{
     		city:
       		{ $near :
          		{
            		$geometry: { type: "Point",  coordinates: req.body.city.coordinates },
            		$maxDistance: 100000
          		}
       		}
   		});


		if((location).length>0)
   		{
   			res.status(200).json({
			status: 'true',
			message: "location available"
		})
   		}else{
   			res.status(200).json({
			status: 'false',
			message: "location not found "
   		})
   		}

   		console.log(location);

   		}catch(err){
		res.status(400).json({
			status: 'fail',
			message: err
		});
	}
	
}