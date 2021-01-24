const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const mail = require('nodemailer')

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
          .then(userinstance => res.json(userinstance))
          .catch(err => res.status(400).json({ err }));
    }
    else{
      return res.status(400).json({ user: "User not found!" })
    }
});

// @route   POST api/applicant/addSkill
// @desc    Add Applicant Skill
// @access  Public
router.post("/addSkill", async (req, res) => {
    
    const user = await ApplicantDetails.findById(req.body.id);
    
    if(user){
        if(!user.skills.includes(req.body.skill)){
          user.skills.unshift(req.body.skill);
          user
          .save()
          .then(userinstance => res.json(userinstance))
          .catch(err => res.status(400).json({ err }));
        }
    }
    else{
      return res.status(400).json({ user: "User not found!" })
    }
});

// @route   POST api/applicant/addApplication
// @desc    Add Application
// @access  Public
router.post("/addApplication", async (req, res) => {
    
    const user = await ApplicantDetails.findById(req.body.applicantId);
    if(user){

        const application = await Application.findOne({applicantId: req.body.applicantId, status: 2});
        const applications = await Application.find({applicantId: req.body.applicantId, status: { $lt: 2 }});
        const application_already = await Application.findOne({applicantId: req.body.applicantId, jobId: req.body.jobId, status: { $lt: 2 }});

        if(application){
          return res.status(400).json({ applicationErr: "Already accepted in another job listing." });
        }

        if(application_already){
          return res.status(400).json({ applicationErr: "Application already sent" });
        }

        if(applications.length>=10){
          return res.status(400).json({ applicationErr: "Number of applications exceeded." });
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

              await Job.updateOne({_id: req.body.jobId}, {$inc: {currApplications: 1}});

              newApplication
                .save()
                .then(application => res.json(application))
                .catch(err => res.status(400).json({ err }));
            }
            else{
              return res.status(400).json({ applicationErr: "Applications for this job is full." });
            }
          }
        }
    }
    else{
      return res.status(400).json({ userErr: "User not found!" })
    }
});

// @route   POST api/applicant/viewMyApplications
// @desc    View applicant's applications
// @access  Public
router.post("/viewMyApplications", async (req, res) => {

  try{
    application = await Application.find({applicantId: req.body.id });
    
    var len = application.length;
    var data = [];

    for(var i = 0; i<len; i++){
      job = await Job.findById(application[i].jobId);
      var temp_data = {};
      temp_data['application'] = application[i];
      temp_data['job'] = job;
      data.push(temp_data);
    }

    res.json(data);
  }
  catch(err){
    res.status(400).json({ err });
  }
    
});

// @route   POST api/applicant/changeRating
// @desc    Change Employer's Ratings
// @access  Public
router.post("/changeRating", async (req, res) => {

  const identity = req.body.jobId;
  const user = await ApplicantDetails.findById(req.body.id);

  if(user['ratedBy'].includes(req.body.id)){
    return res.status(400).json({ rating: "Already rated" });
  }

  if(user){

    if(user['rating']==-1)
      await ApplicantDetails.updateOne({'_id': req.body.id}, {$set: {'rating': req.body.rating}});
    else
      await ApplicantDetails.updateOne({'_id': req.body.id}, {$inc: {'rating': req.body.rating}});

    user.ratedBy.unshift(identity);
    user
      .save()
      .then(job => res.json(job))
      .catch(err => res.status(400).json({ err }));
  }
  else{
    return res.status(400).json({ user: "User not found" });
  }

});

// @route   POST api/applicant/changeJobRating
// @desc    Change Job's Ratings
// @access  Public
router.post("/changeJobRating", async (req, res) => {

  const identity = req.body.id;
  const job = await Job.findById(req.body.jobId);

  if(job['ratedBy'].includes(req.body.id)){
    return res.status(400).json({ rating: "Already rated" });
  }

  if(job){

    if(job['rating']==-1)
      await Job.updateOne({'_id': req.body.jobId}, {$set: {'rating': req.body.rating}});
    else
      await Job.updateOne({'_id': req.body.jobId}, {$inc: {'rating': req.body.rating}});

    job.ratedBy.unshift(identity);
    job
      .save()
      .then(job_item => res.json(job_item))
      .catch(err => res.status(400).json({ err }));
  }
  else{
    return res.status(400).json({ user: "User not found" });
  }

});



// @route   POST api/applicant/changeApplicationStatus
// @desc    Change application status
// @access  Public
router.post("/changeApplicationStatus", async (req, res) => {
  
  try{
    if(req.body.change=="shortlist"){
      await Application.updateOne({_id: req.body.id}, {$set: {status: 1}})
      return res.json()
    }
    else if(req.body.change=="accept"){

      const date = new Date();
      const application = await Application.findById(req.body.id);
      const applications = await Application.find({'applicantId': application['applicantId']});
      const user = await User.findById(application['applicantId']);
      const curr_job = await Job.findById(application['jobId']);
      
      var len = applications.length;
      for(var i = 0; i<len; i++){
        const job = await Job.findById(applications[i].jobId);
        const application = await Application.findById(applications[i]['_id']);
        if(application['status'] == 2){
          return res.status(400).json({ application: "Already accepted somewhere else." });
        }
        if(application['status'] < 2){
          await Job.updateOne({'_id': applications[i].jobId}, {$inc: {currApplications: -1}});
          await Application.updateOne({'_id':  applications[i]['_id']}, {$set: {status: 3, lastUpdated: date}});
        }
      }
      await Application.updateOne({_id: req.body.id}, {$set: {status: 2, lastUpdated: date}})

      const transport = mail.createTransport({
        service: 'Gmail',
        auth: {
          user: 'ssadprajneya@gmail.com',
          pass: 'XDFFVu4X2E9DHpcv'
        }
      })

      // send email
      const email = {
        from: 'ssadprajneya@gmail.com',
        to: user.email,
        subject: 'Your Job Application is Accepted',
        html: `<h1>Your job application for Job Title: ${curr_job['title']} has been accepted by ${curr_job['name']}</h1>`
      }

      await transport.sendMail(email, async (err) => {
        if(err)
          return res.status(400).json({ err })
        else
          return res.json()
      })


    }
    else if(req.body.change=="reject"){
      await Application.updateOne({_id: req.body.id}, {$set: {status: 3}})

      const application = await Application.findById(req.body.id);
      await Job.updateOne({_id: job['_id']}, {$inc: {currApplications: -1}});
      return res.json()
    }
  }
  catch(err){
    res.status(400).json({ err });
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