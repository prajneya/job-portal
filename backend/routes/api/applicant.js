const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');

// Load User Model
const User = require('../../models/User').User;
const ApplicantDetails = require('../../models/User').applicantDetails;

// @route   POST api/applicant/addInstitution
// @desc    Add Applicant Institution
// @access  Public
router.post("/addInstitution", async (req, res) => {
    
    const user = await ApplicantDetails.findById(req.body.id);
    
    if(user){
        user.education.unshift({
            name: req.body.name,
            startYear: req.body.start,
            endYear: req.body.end
        });

        user
          .save()
          .then(job => res.json(job))
          .catch(err => console.log(err));
    }
});

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../frontend/public/resume');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    cb(null, true);
}

let upload = multer({ storage, fileFilter });

router.route('/uploadResume').post(upload.single('resume'), (req, res) => {
    console.log("FILE", req.file);
    ApplicantDetails.updateOne({_id: req.body.id}, {$set: {resume: req.file.filename}})
           .then(() => res.json('User Added'))
           .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;