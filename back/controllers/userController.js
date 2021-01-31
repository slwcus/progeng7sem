//const auth = require('../middlewares/authMiddleware')
const Event = require('../models/Event');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const path = require('path');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const ms = require('ms')
var os = require( 'os' );


const iface = 'Беспроводная сеть';
const localip = require('local-ip')(iface) || process.env.SERVER_URL;


dotenv.config({path: path.resolve(__dirname, '../config.env')});

const uploadAvatar = async (req, res) => {
   let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.avatar;
  uploadPath = __dirname + '/somewhere/on/your/server/' + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
}

const assignUser = async (req, res) =>{

  const event = await Event.findOne({_id: req.body.event_id})
  const user = await User.findOne({_id: req.params.id})

//todo get user id from route
  if(!event){
    return res.status(404).send("not found event to assign")
  }

  if(!user){
    return res.status(404).send("not found user to assign")
  }

  event.participants.push(user)
  user.event = event
  user.role = req.body.role

  event.save(function(err){
    if(err){
      return res.status(500).send("error on save event")
    }
  })
   
   user.save(function(err){
    if(err){
      console.log(err)
       return res.status(500).send("error on save user")
    } else {
        res.status(200).send({role: user.role})
    }
   })
  // create reusable transporter object using the default SMTP transport  

};



const unassignUser = async (req, res) =>{

  
  const user = await User.findOne({_id: req.params.id}).populate('event')
 
  if(!user){
    return res.status(404).send("not found user to assign")
  } 

 Event.updateOne({_id: user.event}, {$pull : {participants: user._id}}, function(err){
    if(err){
      res.status(500).send("error on save user")
    } else {
      user.event = null
      user.role = 1
      user.save(function(err){
        if(err) res.status(500).send("error on save user")
        else res.status(200).send("success")
      })
    }
 })
   
 
};

exports.updateUser = async function (req,res) {

  const user = await User.findById(req.params.id)

  if(!user){
    res.status(404).send("no such user")
  }

  if(req.body.new_password){
    user.password = req.body.new_password
  }
  user.first_name = req.body.first_name
  user.last_name = req.body.last_name
  user.about = req.body.about
  user.country = req.body.country
  user.country_region = req.body.country_region
  user.pin = req.body.pin

  user.save(function (err) {
    if(err){
      console.log(err)
      res.status(500).send("error on save user")
    } else{
     res.status(200).send("success")
    }
  })

  

}

exports.confirmEmail = async function (req, res){
  const user = await User.findOne({email: req.body.email})

  if(!user){
    return res.status(531).send("User with this email not found")
  } else if(user.confirmed){
    return res.status(532).send("User aleady exist")
  }

  sendConfirmMessage(user).then(() => {
    return res.status(200).send("Link sent")
  }).catch(err => {
     return res.status(500).send("failure to send message")
  })

}

exports.addUser = async function (req, res){


   let newUser = new User({
   		first_name: req.body.first_name,
   		last_name: req.body.last_name,
   		email: req.body.email,
   		password: req.body.password,
   		country: req.body.country,
   		country_region: req.body.country_region,
   		role: 1,
   		confirmed: false,
   		avatar: '',
   		pin: null
   })

   const user = await User.findOne({email: req.body.email})

   if(user){
    return res.status(530).send("User with this email already exists")
   }

   newUser.save(function(err) {
	    if (err) {
	    	return res.status(500).send("Ошибка при создании пользователя")
	    } else {
        return res.status(200).send("letter sent")
      }
	});
};


//rework this with promises
async function sendConfirmMessage(newUser){  

  return new Promise(async(resolve, reject) => {
    //let testAccount = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports 587
      auth: {
        user: 'deivaish.ads@gmail.com', // generated ethereal user
        pass: 'Deivaish5467', // generated ethereal password
      },
    });

    let token = jwt.sign({ email: newUser.email }, process.env.TOKEN_SECRET, { expiresIn: ms(process.env.TOKEN_EXPIRATION) })

    let confirmUrl = `http://${localip}:${process.env.PORT}/api/auth/confirm?token=${token}`


    try{
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `"Program engineering SPA" <deivaish.ads@gmail.com>`, // sender address
        to: newUser.email, // list of receivers
        subject: "Email confirmation", // Subject line
        text: `Your link to complete registration ${confirmUrl}`, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      resolve("success")
    } catch(err){
      reject(err)
    }

  })
}

exports.getUsers = async function(req, res){
     const users = await User.find({role: {$gt: 0}, confirmed: true}, '-password').sort({'event': 1, 'register_date': 1})

     if(users){
     	res.status(200).send({users: users})
     } else {
     	res.status(200).send()
     }
};




exports.auth = (req, res) => {
	//res.json(await User.findById(req.params.email));
	User.findOne({email: req.body.email}, (err, result) => {
		if(err){
			console.error(err)
		} else{
			res.json(result);
		}
	})
};



exports.testadmin = function(request, response){
	var testUser = new Role({
		name: 'No role',
    id: 1
	});
	     
	// save the user to database
	testUser.save(function(err) {
	    if (err) throw err;
	});
	response.send("Vrode uspeshno");
}


exports.assignUser = assignUser
exports.unassignUser = unassignUser
exports.uploadAvatar = uploadAvatar
