const ms = require('ms');
const User = require('../models/User');
const RefreshSession = require('../models/RefreshSession');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const path = require('path');
const jwt_decode = require('jwt-decode')

 const { v4: uuidv4 } = require('uuid');

dotenv.config({path: path.resolve(__dirname, '../config.env')});

/*response.cookie('JWT', '1234', {
maxAge: 86_400_000,
httpOnly: true
});
response.render('<h1>Cookie has been send with the response</h1>');*/


function createRefreshToken(user){
 	const refTokenExpiresInMilliseconds = Date.now() + ms(process.env.REFRESH_TOKEN_EXPIRATION)
    const refTokenExpiresInSeconds = parseInt(refTokenExpiresInMilliseconds / 1000)
    var refreshSession = new RefreshSession({
    		userId: user._id,
    		expiresIn: refTokenExpiresInMilliseconds,
    		refreshId: uuidv4()
    })
    refreshSession.save(function(err){
    	if(err) {
    		return null
    	}
    })
    return refreshSession.refreshId
}

function createAccessToken(user){
	var data = {
				id: user.id,
				email: user.email,
				confirmed: user.confirmed,
				role: user.role,
				first_name: user.first_name,
			    last_name: user.last_name,
			    country: user.country,
			    country_region: user.country_region,
			    pin: user.pin,
			    about: user.about
			}
	const accessToken = jwt.sign({ data }, process.env.TOKEN_SECRET, { expiresIn: ms(process.env.TOKEN_EXPIRATION) });
	return `Bearer ${accessToken}`
}

const checkPassword = async (req, res) => {
	var user = await User.findById(req.body.id)
	
	if(!user){
		res.status(404).send("No such user")
	} else if(user.comparePassword(req.body.password)){
		res.status(200).send("password correct")
	} else {
		res.status(401).send("password is incorrect")
	}
}

exports.checkPassword = checkPassword

const confirm = async (req, res) => {

	

	if(!req.query.token) {
		res.status(401).send("no token")
	}


	
	var decoded = jwt_decode(req.query.token);	

	await User.updateOne({email: decoded.email}, {confirmed: true}, async function(err) {
		if(err){
			res.status(500).send("confirm failed")
		} else {
			const user = await User.findOne({email: decoded.email})
			const refreshToken = createRefreshToken(user)
			res.cookie('refreshToken', refreshToken, 
				{maxAge: ms(process.env.REFRESH_TOKEN_EXPIRATION), httpOnly: true, path: '/api/auth'});
			const query = querystring.stringify({
				refreshToken: refreshToken 
			})
			res.redirect(`/confirmation?${query}`)
			//res.status(200).send("asd")
			//redirect to app with yoken to auth 
		}
	})


}

exports.confirm = confirm

const refresh = async (req,res) => {
	if(!req.cookies.refreshToken && !req.query.refreshToken){
		return res.status(433).send("no refresh token");
	}
	console.log(req.cookies.refreshToken)
	console.log(req.query.refreshToken)

	let refreshToken = req.cookies.refreshToken || req.query.refreshToken
	let refreshSession = await RefreshSession.findOneAndDelete({refreshId: refreshToken})

	if(!refreshSession) {
		return res.status(434).send("no sesion with that token");
	}
	if(Date.now() > refreshSession.expiresIn) {
		return res.status(435).send("token expierd");
	}
	
	const user = await User.findOne({_id: refreshSession.userId})

	if(!user){
		return res.status(436).send("no such user");
	}

	refreshToken = createRefreshToken(user)
	const accessToken = createAccessToken(user)

	res.cookie('refreshToken', refreshToken, {maxAge: ms(process.env.REFRESH_TOKEN_EXPIRATION), httpOnly: true, path: '/api/auth'});
	res.status(200).send({token: accessToken});
}

exports.refresh = refresh;

const logout = async (req,res) => {
	if(!req.cookies.refreshToken){
		return res.status(500).send("no refresh token to delete");
	}

	let refreshToken = req.cookies.refreshToken
	await RefreshSession.deleteOne({ refreshId: refreshToken }, function (err) {
	  if (err) return res.status(500).send(err)
	});
	res.status(200).send("Logout success");
}

exports.logout = logout;


const auth = async (req,res) => {
	var user = await User.findOne({email: req.body.email})
	
	if(!user){
		res.status(401).send("No such user")
	} else if(user.comparePassword(req.body.password)){

		await RefreshSession.findOneAndDelete({userId: user.id})
		const refreshToken = createRefreshToken(user)
		const accessToken = createAccessToken(user)
		
    	res.cookie('refreshToken',refreshToken,{maxAge: ms(process.env.REFRESH_TOKEN_EXPIRATION), httpOnly: true, path: '/api/auth'})
			res.status(200).send({ token: accessToken})
	} else {
		res.status(401).send("password is incorrect")
	}
}

exports.auth = auth;