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
const Job = require('../../models/Jobs').Job;
const Application = require('../../models/Jobs').Application;

var mongoose = require('mongoose');

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

// @route   POST api/applicant/addApplication
// @desc    Add Application
// @access  Public
router.post("/addApplication", async (req, res) => {
    
    const user = await ApplicantDetails.findById(req.body.applicantId);
    if(user){

        const application = await Application.findOne({applicantId: req.body.applicantId, status: 2});

        if(application){
          console.log(application.status);
          throw new Error("Already accepted in another job listing.")
        }

        if(user.currApplications.length==10){
          throw new Error("Number of applications exceeded.");
        }
        else{
          const job = await Job.findById(req.body.jobId);
          if(job){
            if(job.currApplications < job.applications){
              const newApplication = new Application({
                applicantId: req.body.applicantId,
                jobId: req.body.jobId,
                sop: req.body.sop,
              });

              newApplication
                .save()
                .then(application => res.json(application))
                .catch(err => console.log(err));
            }
            else{
              throw new Error("Applications for this job is full.");
            }
          }
        }
    }
});

// @route   POST api/applicant/viewMyApplications
// @desc    View applicant's applications
// @access  Public
router.post("/viewMyApplications", async (req, res) => {

    application = await Application.find({applicantId: req.body.id});
    
    var len = application.length;
    var data = [];

    for(var i = 0; i<len; i++){
      job = await Job.findById(application[i].jobId);
      if(job.active){
        var temp_data = {};
        temp_data['application'] = application[i];
        temp_data['job'] = job;
        data.push(temp_data);
      }
    }

    res.json(data);
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