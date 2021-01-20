const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User Model
const User = require('../../models/User').User;
const Job = require('../../models/Jobs').Job;
const ApplicantDetails = require('../../models/User').applicantDetails;
const RecruiterDetails = require('../../models/User').recruiterDetails;

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  // Form validation
const { errors, isValid } = validateRegisterInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        userType: req.body.userType
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              res.json(user);
              if(user.userType===0){
                const newApplicantDetail = new ApplicantDetails({
                  _id: user.id,
                  education: [],
                  skills: [],
                  resume: "",
                  profilePic: "reaper.png",
                  rating: -1,
                  ratedBy: []
                });

                newApplicantDetail
                  .save()
                  .catch(err => console.log(err));
              }
              else if(user.userType===1){
                const newRecruiterDetail = new RecruiterDetails({
                  _id: user.id,
                  contactNum: "",
                  bio: "",
                  profilePic: "reaper.png"
                });

                newRecruiterDetail
                  .save()
                  .catch(err => console.log(err));
              }
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// @route   POST api/users/getProfile
// @desc    Get personal details of any user
// @access  Public
router.post("/getProfile", (req, res) => {

  User.findById(req.body.id)
    .then(userDetail => res.json(userDetail))
    .catch(err => console.log(err));
});

// @route   POST api/users/getApplicantProfile
// @desc    Get details of Applicant user
// @access  Public
router.post("/getApplicantProfile", (req, res) => {

  ApplicantDetails.findById(req.body.id)
    .then(applicantDetail => res.json(applicantDetail))
    .catch(err => console.log(err));
});

// @route   POST api/users/getRecruiterProfile
// @desc    Get details of Recruiter user
// @access  Public
router.post("/getRecruiterProfile", (req, res) => {

  RecruiterDetails.findById(req.body.id)
    .then(recruiterDetail => res.json(recruiterDetail))
    .catch(err => console.log(err));
})

// @route   POST api/users/updatePersonal
// @desc    Update personal details of any user
// @access  Public
router.post("/updatePersonal", async (req, res) => {

  const user = await User.findById(req.body.id);

  if(user['userType']==0){
    User.updateOne({_id: req.body.id}, {$set: {name: req.body.name, email: req.body.email}})
      .then(userDetail => res.json(userDetail))
      .catch(err => console.log(err));
  }
  else if(user['userType']==1){
    await User.updateOne({_id: req.body.id}, {$set: {name: req.body.name, email: req.body.email}})
      .then(userDetail => res.json(userDetail))
      .catch(err => console.log(err));

    await Job.updateMany({createdBy: req.body.id}, {$set: {name: req.body.name, email: req.body.email}})
  }
});

// @route   POST api/users/updateRecruiter
// @desc    Update recruiter details of any employer
// @access  Public
router.post("/updateRecruiter", (req, res) => {

  RecruiterDetails.updateOne({_id: req.body.id}, {$set: {contactNum: req.body.contactNum, bio: req.body.bio}})
    .then(userDetail => res.json(userDetail))
    .catch(err => console.log(err));
});

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../frontend/public/images/profilepics');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });

router.route('/uploadProfilePic').post(upload.single('photo'), (req, res) => {
    if(req.body.userType==0){
      ApplicantDetails.updateOne({_id: req.body.id}, {$set: {profilePic: req.file.filename}})
        .then(() => res.json('User Added'))
        .catch(err => res.status(400).json('Error: ' + err));
    }
    else if(req.body.userType==1){
      RecruiterDetails.updateOne({_id: req.body.id}, {$set: {profilePic: req.file.filename}})
        .then(() => res.json('User Added'))
        .catch(err => res.status(400).json('Error: ' + err));
    }
});

module.exports = router;