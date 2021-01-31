 const ms = require('ms');
 const constants = require('./constants.js')
const mongoose = require('mongoose')
const Role = require('./models/Role');
const RefreshSession = require('./models/RefreshSession');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const path = require('path');
const jwt_decode = require('jwt-decode')
const Event = require('./models/Event')
const Document = require('./models/Document')
const User = require('./models/User')

const roles = ['Admin','Unconfirmed','Expert','Participant']

function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

async function generateTestData()  {


	let adminUser = new User({
		first_name: "admin",
	    last_name: "admin",
	    email: "admin@test.com",
	    country: "AFG",
	    password: "123456",
	    role: 0,
	    confirmed: true,
	})

	adminUser.save(function(err){
		if(err) console.log(err)
	})

	for(let i = 0; i < 10; i++){

		let testUser = new User({
			first_name: `firstname ${i+1}`,
		    last_name: `lastname ${i+1}`,
		    email: `user${i+1}@test.com`,
		    country: "AFG",
		    password: "123456",
		    role: 1,
		    confirmed: true,
		    register_date: new Date()
		})

		testUser.save(function(err){
		if(err) console.log(err)
	})

		var startDate = new Date()
		startDate.setDate(startDate.getDate() + getRandomArbitrary(-15, 15))
		var c1 = new Date(startDate)

		c1.setDate(c1.getDate() + getRandomArbitrary(1, 5)) 
		var cPlus = new Date(c1)
		cPlus.setDate(cPlus.getDate() + getRandomArbitrary(1, 5))
		var finish = new Date(cPlus)
		finish.setDate(finish.getDate() + getRandomArbitrary(1, 5))

	 	let newEvent = new Event({
	      title: `event title ${i+1}`,
	      start_date: startDate,
	      c1_date: c1,
	      cplus_date: cPlus,
	      finish_date: finish
	   })

	  	newEvent.save(function(err){
		if(err) console.log(err)
	});  



  	 	let doc1 = new Document({
	      title: `event ${i+1} doc1`,
	      day: "C-1",
	      event_id: newEvent,
	      content: `event ${i+1} doc1`,
	      role: getRandomArbitrary(2, 3),
	      deleted: false
	   	})

	 	 doc1.save(function(err){
		if(err) console.log(err)
	})

		let doc2 = new Document({
	      title: `event ${i+1} doc2`,
	      day: "C1",
	      event_id: newEvent,
	      content:`event ${i+1} doc1`,
	      role: getRandomArbitrary(2, 3),
	      deleted: false
	   	})

	 	 doc2.save(function(err){
		if(err) console.log(err)
	})

		let doc3 = new Document({
	      title: `event ${i+1} doc3`,
	      day: "C+1",
	      event_id: newEvent,
	      content: `event ${i+1} doc1`,
	      role: getRandomArbitrary(2, 3),
	      deleted: false
	   	})

	 	 doc3.save(function(err){
		if(err) {console.log(err)} else {
			if(i == 9) {
				mongoose.disconnect()
			}
		}
		})
 	}

 	

}

async function generateRoles() {
	for(let i = 0; i< roles.length; i++){
		let newRole = new Role({
			id: i,
			name: roles[i], 
			isTechnical : i < 2
		})

		newRole.save(function(err){
		if(err) console.log(err)
	})
	}
}

mongoose.connect(constants.DB_PATH, { useNewUrlParser: true })
    .then(db => console.log('[OK] DB is connected'))
    .catch(err => console.error(err));

generateRoles()
generateTestData()

console.log('Generated')