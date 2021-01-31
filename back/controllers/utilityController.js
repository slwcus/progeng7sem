const ms = require('ms');
const Role = require('../models/Role');
const RefreshSession = require('../models/RefreshSession');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const path = require('path');
const jwt_decode = require('jwt-decode')
const Event = require('../models/Event')
const Document = require('../models/Document')

 const { v4: uuidv4 } = require('uuid');

dotenv.config({path: path.resolve(__dirname, '../config.env')});

const getRoles = async (req, res) => {

	const roles = await Role.find({isTechnical: false})	

	if(!roles) {
		res.status(404).send("no roles found")
	}

	res.status(200).send({roles: roles})

}

exports.getRoles = getRoles
