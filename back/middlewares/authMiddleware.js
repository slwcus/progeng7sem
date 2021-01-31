/*const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

exports.authenticateToken = (req, res, next) => {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401) // if there isn't any token

  jwt.verify(token, process.env.TOKEN_SECRET, (err: any, user: any) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next() // pass the execution off to whatever request the client intended
  })
}

exports.generateAccessToken = (email) => {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}
*/
const path = require('path')
const jwt  = require('express-jwt')
const dotenv = require("dotenv");

dotenv.config({path: path.resolve(__dirname, '../config.env')});

console.log(process.env.TOKEN_SECRET)

exports.expjwt = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ['HS256'],
}) 

const isAdmin = (req,res, next) => {
  if(req.user.data.role != 0){
    console.log(req.jwt)
    return res.status(401).send("NOt admin")
  }
  console.log(98989)
  next()
}

exports.isAdmin = isAdmin