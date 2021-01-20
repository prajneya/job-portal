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
    .catch(err => console.log(err));
});

// @route   POST api/jobs/edit
// @desc    Edit Job
// @access  Public
router.post("/edit", async (req, res) => {

  Job.updateOne({_id: req.body.id}, {$set: {applications: req.body.applications, positions:req.body.positions, deadline: req.body.deadline}})
      .catch(err => console.log(err));
  res.json();

});

// @route   POST api/jobs/delete
// @desc    Delete Job
// @access  Public
router.post("/delete", async (req, res) => {

  Job.updateOne({_id: req.body.id}, {$set: {active: false}})
      .catch(err => console.log(err));

  Application.updateMany({jobId: req.body.id}, {$set: {status: 4}})
              .catch(err => console.log(err));
  res.json();

});

// @route   GET api/jobs/getAll
// @desc    Get all Jobs
// @access  Public
router.get("/getAll", (req, res) => {

  const date = new Date();
  Job.find({active: true, deadline: { $gt: date }})
    .sort({posting: -1})
    .then(jobs => res.json(jobs))
    .catch(err => console.log(err));
});

// @route   POST api/jobs/getMyJobs
// @desc    Get Jobs of a recruiter
// @access  Public
router.post("/getMyJobs", (req, res) => {

  const date = new Date();
  Job.find({active: true, createdBy: req.body.id, deadline: { $gt: date }})
    .sort({posting: -1})
    .then(jobs => res.json(jobs))
    .catch(err => console.log(err));
});

// @route   POST api/jobs/searchJobs
// @desc    Fuzzy Search on Jobs
// @access  Public
router.post("/searchJobs", (req, res) => {
    const pipeline = [
                      {
                        '$match': {
                          '$or': [
                            {
                              'title': {
                                '$regex': req.body.query, 
                                '$options': 'i'
                              }
                            }
                          ]
                        }
                      }
                    ];

    Job.aggregate(pipeline)
        .then(jobs => res.json(jobs))
        .catch(err => console.log(err));
});

// @route   GET api/jobs/getSkills
// @desc    Get all Skills
// @access  Public
router.get("/getSkills", (req, res) => {

  Skill.find()
    .then(skills => res.json(skills))
    .catch(err => console.log(err));
});

// @route   POST api/jobs/viewJob
// @desc    View particular Job Details
// @access  Public
router.post("/viewJob", async (req, res) => {

  job = await Job.findById(req.body.id);
  applications = await Application.find({jobId: req.body.id, status: { $lt: 3 }});
    
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

});

// @route   POST api/jobs/viewJobData
// @desc    View particular Job Details for edit
// @access  Public
router.post("/viewJobData", async (req, res) => {

  Job.findById(req.body.id)
    .then(job => res.json(job))
    .catch(err => console.log(err));

});

// @route   POST api/jobs/viewEmployees
// @desc    View all Employees' Details
// @access  Public
router.post("/viewEmployees", async (req, res) => {

  jobs = await Job.find({createdBy: req.body.id});
    
  var len = jobs.length;
  var data = [];

  for(var i = 0; i<len; i++){
    var temp_data = {};
    temp_data['job'] = jobs[i];
    temp_data['application'] = await Application.findOne({jobId: jobs[i]['_id'], status: 2});
    if(temp_data['application']){
      temp_data['applicant'] = await User.findById(temp_data['application'].applicantId);
      temp_data['applicantDets'] = await ApplicantDetails.findById(temp_data['application'].applicantId);  
      if(temp_data['applicantDets']['ratedBy'].includes(jobs[i]['_id'])){
        temp_data['hasRated'] = true;
      }
      else{
        temp_data['hasRated'] = false;
      }
      data.push(temp_data);
    }
    else{
      continue;
    }
  }

  res.json(data);

});

module.exports = router;