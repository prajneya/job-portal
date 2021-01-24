const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load Job Model
const Job = require('../../models/Jobs').Job;
const Skill = require('../../models/Jobs').Skill;
const Application = require('../../models/Jobs').Application;
const User = require('../../models/User').User;
const ApplicantDetails = require('../../models/User').applicantDetails;

// @route   POST api/jobs/add
// @desc    Add Job
// @access  Public
router.post("/add", (req, res) => {

  const newJob = new Job({
    title: req.body.title,
    name: req.body.name,
    email: req.body.email,
    createdBy: req.body.id,
    applications: req.body.applications,
    positions: req.body.positions,
    deadline: req.body.deadline,
    skillset: req.body.skillset,
    jobType: req.body.jobType,
    duration: req.body.duration,
    description: req.body.description,
    salary: req.body.salary
  });

  newJob
    .save()
    .then(job => res.json(job))
    .catch(err => res.status(400).json({ err }));
});

// @route   POST api/jobs/edit
// @desc    Edit Job
// @access  Public
router.post("/edit", async (req, res) => {

  Job.updateOne({_id: req.body.id}, {$set: {applications: req.body.applications, positions:req.body.positions, deadline: req.body.deadline}})
      .catch(err => res.status(400).json({ err }));
  res.json({success: "Job edited Successfully"});

});

// @route   POST api/jobs/delete
// @desc    Delete Job
// @access  Public
router.post("/delete", async (req, res) => {

  Job.updateOne({_id: req.body.id}, {$set: {active: false}})
      .catch(err => res.status(400).json({ err }));

  Application.updateMany({jobId: req.body.id}, {$set: {status: 4}})
              .catch(err => res.status(400).json({ err }));
  res.json({success: "Job deleted Successfully"});

});

// @route   POST api/jobs/getAll
// @desc    Get all Jobs
// @access  Public
router.post("/getAll", async (req, res) => {

  try{
    const date = new Date();
    const jobs = await Job.find({active: true, deadline: { $gt: date }}).sort({posting: -1});

    const data = []

    var len = jobs.length;

    for(var i = 0; i<len; i++){
      var temp_data = {};
      temp_data['job'] = jobs[i];
      const application = await Application.find({applicantId: req.body.userId, jobId: jobs[i]['_id'], status: { $lt: 3 }});
      if(application.length!=0){
        temp_data['hasApplied'] = true;
      }
      else{
        temp_data['hasApplied'] = false;
      }
      data.push(temp_data);
    }

    res.json(data);
  }
  catch(err){
    res.status(400).json({ err });
  }

});

// @route   POST api/jobs/getMyJobs
// @desc    Get Jobs of a recruiter
// @access  Public
router.post("/getMyJobs", (req, res) => {

  const date = new Date();
  Job.find({active: true, createdBy: req.body.id, deadline: { $gt: date }})
    .sort({posting: -1})
    .then(jobs => res.json(jobs))
    .catch(err => res.status(400).json({ err }));
});

// @route   POST api/jobs/searchJobs
// @desc    Fuzzy Search on Jobs
// @access  Public
router.post("/searchJobs", (req, res) => {
    const date = new Date();
    const pipeline = [
                      {
                        '$match': {
                          '$or': [
                            {
                              'title': {
                                '$regex': req.body.query, 
                                '$options': 'i'
                              },
                              active: true,
                              deadline: {
                                $gt: date
                              }
                            }
                          ]
                        }
                      }
                    ];

    Job.aggregate(pipeline)
        .then(async jobs => {
          const date = new Date();
          const data = []
          var len = jobs.length;

          for(var i = 0; i<len; i++){
            var temp_data = {};
            temp_data['job'] = jobs[i];
            const application = await Application.find({applicantId: req.body.userId, jobId: jobs[i]['_id'], status: { $lt: 3 }});
            if(application.length!=0){
              temp_data['hasApplied'] = true;
            }
            else{
              temp_data['hasApplied'] = false;
            }
            data.push(temp_data);
          }

          res.json(data);
        })
        .catch(err => res.status(400).json({ err }));
});

// @route   GET api/jobs/getSkills
// @desc    Get all Skills
// @access  Public
router.get("/getSkills", (req, res) => {

  Skill.find()
    .then(skills => res.json(skills))
    .catch(err => res.status(400).json({ err }));
});

// @route   POST api/jobs/viewJob
// @desc    View particular Job Details for Employer
// @access  Public
router.post("/viewJob", async (req, res) => {

  try{
    job = await Job.findById(req.body.id);
    applications = await Application.find({jobId: req.body.id, status: { $lt: 2 }});
      
    var len = applications.length;
    var data = {
      job: job,
      applications: []
    };

    for(var i = 0; i<len; i++){
      var temp_data = {};
      temp_data['application'] = applications[i];
      temp_data['applicant'] = await User.findById(applications[i].applicantId);
      temp_data['applicantDets'] = await ApplicantDetails.findById(applications[i].applicantId);
      data['applications'].push(temp_data);
    }

    res.json(data);
  }
  catch (err){
    res.status(400).json({ err });
  }

});

// @route   POST api/jobs/viewApplication
// @desc    View particular Application Details
// @access  Public
router.post("/viewApplication", async (req, res) => {

  try{
    var application = await Application.findById(req.body.id);
    var job = await Job.findById(application['jobId']);
      
    var data = {
      job: job,
      application: application,
      hasRated: true
    };

    if(!job['ratedBy'].includes(application['applicantId'])){
      data['hasRated'] = false;
    }

    res.json(data);
  }
  catch(err){
    res.status(400).json({ err });
  }

});

// @route   POST api/jobs/viewJobData
// @desc    View particular Job Details for edit
// @access  Public
router.post("/viewJobData", async (req, res) => {

  Job.findById(req.body.id)
    .then(job => res.json(job))
    .catch(err => res.status(400).json({ err }));

});

// @route   POST api/jobs/viewEmployees
// @desc    View all Employees' Details
// @access  Public
router.post("/viewEmployees", async (req, res) => {

  try{
    jobs = await Job.find({createdBy: req.body.id});
    
    var len = jobs.length;
    var data = [];

    for(var i = 0; i<len; i++){
      applications = await Application.find({jobId: jobs[i]['_id'], status: 2});

      if(applications){
        var applications_len = applications.length;

        for(var j = 0; j<applications_len; j++){
          var temp_data = {};
          temp_data['job'] = jobs[i];
          temp_data['application'] = applications[j];
          temp_data['applicant'] = await User.findById(applications[j].applicantId);
          temp_data['applicantDets'] = await ApplicantDetails.findById(applications[j].applicantId);  
          if(temp_data['applicantDets']['ratedBy'].includes(jobs[i]['_id'])){
            temp_data['hasRated'] = true;
          }
          else{
            temp_data['hasRated'] = false;
          }
          data.push(temp_data);
        } 
      }
      else{
        continue;
      }
    }

    res.json(data);
  }
  catch(err){
    res.status(400).json({ err });
  }

});

module.exports = router;