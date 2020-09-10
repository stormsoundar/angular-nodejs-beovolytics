var express = require('express');
var router = express.Router();

var app = express();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// include user model
const User = require('../model/model');

router.post('/save-user', function(req, res) {
      // validate request
      if(
        !req.body.name || 
        !req.body.address || 
        !req.body.email || 
        !req.body.username || 
        !req.body.password || 
        !req.body.technologies || 
        !req.body.degree || 
        !req.body.experience || 
        !req.body.company) {
        return res.status(400).send({
            success: false,
            message: "Please fill all fields!"
        });
    }
    bcrypt.hash(req.body.password, 10)
        .then(hash => {       
    // create a user
    let user = new User(
        {
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
            username: req.body.username,
            password: hash,
            technologies: req.body.technologies,
            degree: req.body.degree,
            experience: req.body.experience,
            company: req.body.company
        }
    );
   // save user in the database.
   user.save()
   .then(data => {
       res.json({
           success: true,
           message: 'User successfully created',
           data: data
       });
   }).catch(err => {
   res.status(500).json({
       success: false,
       message: err.message || "Some error occurred while creating the user."
   });
});
});
});

// /* GET users listing. */
router.get('/all-users', function(req, res, next) {    
    User.find()
    .then(data => {      
      res.json({
          success: true,
          message: "User fetched Successfully!",
          data: data
      });
  }).catch(err => {
      console.log(err);
  res.status(500).json({
      success: false,
      message: err.message || "Some error occurred while retrieving users." 
  });
  });
  });

router.post('/login', (req, res, next) => {
    User.findOne({username: req.body.username})
        .then(user => {
            if(!user){
                return res.status(401).json({
                    message: "Incorrect Username"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if(!result) {
                return res.status(401).json({
                    message: "Incorrect Username or Password"
                })
            }
            const token = jwt.sign(
                { username: fetchedUser.username, userId: fetchedUser._id },
                "secret_this_should_be_longer",
                { expiresIn: "1h" }
                );
                res.status(200).json({
                    token: token
                });
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Incorrect Email or Password'
            })
        })
});

module.exports = router;
